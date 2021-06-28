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
    class keyboard
    {
        [DllImport("user32.dll")]
        static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        /*
        48	0 key
        49	1 key
        50	2 key
        51	3 key
        52	4 key
        53	5 key
        54	6 key
        55	7 key
        56	8 key
        57	9 key
        65	A key
        66	B key
        67	C key
        68	D key
        69	E key
        70	F key
        71	G key
        72	H key
        73	I key
        74	J key
        75	K key
        76	L key
        77	M key
        78	N key
        79	O key
        80	P key
        81	Q key
        82	R key
        83	S key
        84	T key
        85	U key
        86	V key
        87	W key
        88	X key
        89	Y key
        90	Z key
        */
        public static void press(byte keycode)
        {
            /*********
            keycode example: 'A','W','S','D','J','F'
             * **********/
            keybd_event(keycode, 0, 0, 0);
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            var BtnKey = new Dictionary<int, KEYS>
        {
            { 1, KEYS.J},
            { 2, KEYS.F },
            { 3, KEYS.D},
            { 4, KEYS.K },
            { 5, KEYS.S },
        };
            //串口通訊setting
            string[] ports = SerialPort.GetPortNames();
            SerialPort arduino_port = new SerialPort();
            arduino_port.BaudRate = 9600; //需跟arduno設定的一樣

            //在Yun這塊板子中，一定要加上這行來啟用DTR訊號；其他板子不一定需要。 
            // detect the arduino_port

            // Display each port name to the console.
            if (ports.Length == 0)
            {
                Console.WriteLine("No Serial Port Found!!");
                Thread.Sleep(3000);
                return;
            }
            foreach (string port in ports)
            {
                Console.WriteLine("The following serial port was found: {0}", port);
                arduino_port.PortName = port; //指定PortName  
                break;
            }
            arduino_port.Open();
            arduino_port.DtrEnable = true;
            Console.WriteLine("\nBUTTON 1: {0}\nBUTTON 2: {1}\nBUTTON 3: {2}\nBUTTON 4: {3}\nBUTTON 5: {4}\n",
                BtnKey[1],
                BtnKey[2],
                BtnKey[3],
                BtnKey[4],
                BtnKey[5]
                );
            //開始讀值
            while (true)
            {
                //讀取port傳入, 假設輸入為字串內容為按鈕的ASC2
                string data = arduino_port.ReadLine();
                int number = Int32.Parse(data);
                Console.WriteLine("Press: {0}",number);
              //把輸入做轉換,觸發鍵盤事件
              keyboard.press((byte)BtnKey[number]);
                //Thread.Sleep(1000);
            }
        }
    }

}
