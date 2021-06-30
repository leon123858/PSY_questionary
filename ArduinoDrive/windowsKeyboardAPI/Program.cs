using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Threading;
using System.IO.Ports;
using System.Management;
namespace windowsKeyboardAPI
{
    enum KEYS : byte
    {
        NULL = 0,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
    }
    class Keyboard
    {
        [DllImport("user32.dll")]
        static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        public static void press(byte keycode)
        {
            /*********
            keycode example: 'A','W','S','D','J','F'
             * **********/
            keybd_event(keycode, 0, 0, 0);
        }
    }
    /*
     *nowMode(Dict):預設為MODE_FJ
     *ChangeMode(Func(string)=>(Dict)):更換Dict
     */
    class Program
    {


        public static readonly Dictionary<int, KEYS> MODE_WASD = new Dictionary<int, KEYS>
                {
                    { 1, KEYS.W},
                    { 2, KEYS.A },
                    { 3, KEYS.S},
                    { 4, KEYS.D },
                    { 5, KEYS.NULL},
                };
        public static readonly Dictionary<int, KEYS> MODE_FJ = new Dictionary<int, KEYS>
                {
                    { 1, KEYS.F},
                    { 2, KEYS.J },
                    { 3, KEYS.NULL},
                    { 4, KEYS.NULL },
                    { 5, KEYS.NULL},
                };
        public static Dictionary<int, KEYS> nowMode = MODE_FJ;
        static void Main(string[] args)
        {

            bool findArduino = false;
            SerialPort arduino_port = new SerialPort
            {
                BaudRate = 9600, //需跟arduno設定的一樣
                DtrEnable = true
            };
            //找尋所有serial port
            using (var searcher = new ManagementObjectSearcher("SELECT * FROM WIN32_SerialPort"))
            {
                //使用ManagementObjectSearcher來查詢註冊表中的裝置名稱 並轉為list
                var uu = searcher.Get().Cast<ManagementBaseObject>().ToList();
                string[] PortsName = new string[uu.Count];
                //取得裝置名稱與連接埠，只挑選arduino_uno
                for (int i = 0; i < uu.Count; i++)
                {
                    if ((uu[i]["Caption"] as string).Contains("Arduino Uno"))
                    {
                        findArduino = true;
                        arduino_port.PortName = uu[i]["DeviceID"] as string;
                        PortsName[i] = uu[i]["DeviceID"] as string + "-" + uu[i]["Caption"] as string;
                        Console.WriteLine("Now Connected: {0}\n", PortsName[i]);
                    }
                }
                //未找到arduino 連接 
                if (!findArduino)
                {
                    Console.WriteLine("Arduino Connected Device not Found");
                    Thread.Sleep(5000);
                    return;
                }
                else
                {
                    arduino_port.Open();
                }
            }
            Console.WriteLine("Mode 1 (Default): FJ \n--------------\nBUTTON 1: {0}\nBUTTON 2: {1}\nBUTTON 3: {2}\nBUTTON 4: {3}\nBUTTON 5: {4}\n",
                MODE_FJ[1],
                MODE_FJ[2],
                MODE_FJ[3],
                MODE_FJ[4],
                MODE_FJ[5]
                );
            Console.WriteLine("Mode 2: WASD\n-------------- \nBUTTON 1: {0}\nBUTTON 2: {1}\nBUTTON 3: {2}\nBUTTON 4: {3}\nBUTTON 5: {4}\n",
                MODE_WASD[1],
                MODE_WASD[2],
                MODE_WASD[3],
                MODE_WASD[4],
                MODE_WASD[5]
                );
            //開始讀值
            while (true)
            {

                //讀取port傳入, 假設輸入為字串內容為按鈕的ASC2
                string data = arduino_port.ReadLine();
                int number = Int32.Parse(data);
                Console.WriteLine("\nPress: {0} => {1}", number,nowMode[number]);
                //把輸入做轉換,觸發鍵盤事件
                Keyboard.press((byte)nowMode[number]);
                //Thread.Sleep(1000);
            }
        }
    }
}

