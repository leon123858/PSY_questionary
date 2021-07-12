using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using System.IO.Ports;
using System.Management;
namespace webServer
{

    enum THREAD_MODE : int
    {
        START = 0,
        STOP = 1,
    }
    class Keyboard
    {
        [DllImport("user32.dll")]
        static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        public static void Press(byte keycode)
        {
            if (keycode != (byte)95)
            {
                keybd_event(keycode, 0, 0, 0);
            }
            else
            {
                Console.WriteLine("Pass");
            }

        }
    }
    class ArduinoWork
    {
        public static readonly Dictionary<int, byte> INIT_MODE = new Dictionary<int, byte>
        {
            { 1, 95},
            { 2, 95},
            { 3, 95},
            { 4, 95},
            { 5, 95},
        };
        public static Dictionary<int, byte> nowMode = INIT_MODE;
        public static string SetMode(string mode)
        {
            string response = "";
            Dictionary<int, byte> tmp_mode = new Dictionary<int, byte>(INIT_MODE);
            if (mode == null || mode.Length - 1 > buttonNum)
            {
                response = "Url not Valid";
            }
            else
            {
                byte[] asciiBytes = Encoding.ASCII.GetBytes(mode);
                //將ascii bytes賦予到mode上
                for (int i = 1; i < asciiBytes.Length; ++i)
                {
                    tmp_mode[i] = asciiBytes[i];
                }
                foreach (KeyValuePair<int, byte> kvp in tmp_mode)
                {
                    response += string.Format("Key = {0}, Value = {1} \n", kvp.Key, Convert.ToChar(kvp.Value));
                }
            }
            nowMode = tmp_mode;
            Console.WriteLine(response);
            return response;
        }
        public static void threadHandle(THREAD_MODE mode)
        {
            switch (mode)
            {
                case THREAD_MODE.START:
                    killthread = false;
                    arduinoThread = new Thread(buttonPress);
                    arduinoThread.Start();
                    break;
                case THREAD_MODE.STOP:
                    killthread = true;
                    break;
                default:
                    break;
            }
        }
        private static void buttonPress()
        {
            bool findArduino = false;
            SerialPort arduino_port = new SerialPort
            {
                BaudRate = 9600, //需跟arduno設定的一樣
                DtrEnable = true
            };
            //找尋所有serial port
            using var searcher = new ManagementObjectSearcher("SELECT * FROM WIN32_SerialPort");
            //使用ManagementObjectSearcher來查詢註冊表中的裝置名稱 並轉為list
            var ports = searcher.Get().Cast<ManagementBaseObject>().ToList();
            string[] PortsName = new string[ports.Count];
            //取得裝置名稱與連接埠，只挑選arduino_uno
            for (int i = 0; i < ports.Count; i++)
            {
                if ((ports[i]["Caption"] as string).Contains("Arduino Uno"))
                {
                    findArduino = true;
                    arduino_port.PortName = ports[i]["DeviceID"] as string;
                    PortsName[i] = ports[i]["DeviceID"] as string + "-" + ports[i]["Caption"] as string;
                    Console.WriteLine("Now Connected: {0}\n", PortsName[i]);
                }
            }
            //未找到arduino 連接 
            if (!findArduino)
            {
                Console.WriteLine("Arduino Connected Device not Found");
                killthread = true;
                Thread.Sleep(5000);
                return;
            }
            else
            {
                arduino_port.Open();
            }
            //開始讀值
            while (true)
            {
                if (killthread)
                {
                    Console.WriteLine("Thread Join");
                    break;
                }
                string data = arduino_port.ReadLine();
                int number = Int32.Parse(data);
                Console.WriteLine("\nPress: {0}, Get {1}", number, Convert.ToChar(ArduinoWork.nowMode[number]));
                //把輸入做轉換,觸發鍵盤事件
                Keyboard.Press((byte)ArduinoWork.nowMode[number]);
                //Thread.Sleep(1000);
            }
        }
        private static readonly int buttonNum = 5;
        private static bool killthread = false;
        private static Thread arduinoThread;
    }
    class Program
    {

        public class CompactRequest
        {
            public string Method, Url, Protocol;
            public Dictionary<string, string> Headers;
            //傳入StreamReader，讀取Request傳入的內容
            public CompactRequest(StreamReader sr)
            {
                //第一列格式如: GET /index.html HTTP/1.1
                string firstLine = sr.ReadLine();
                if (firstLine != null)
                {
                    string[] p = firstLine.Split(' ');
                    Method = p[0];
                    Url = (p.Length > 1) ? p[1] : "NA";
                    Protocol = (p.Length > 2) ? p[2] : "NA";
                }
                //讀取其他Header，格式為HeaderName: HeaderValue
                string line = null;
                Headers = new Dictionary<string, string>();
                while (!string.IsNullOrEmpty(line = sr.ReadLine()))
                {
                    int pos = line.IndexOf(":");
                    if (pos > -1)
                        Headers.Add(line.Substring(0, pos),
                            line.Substring(pos + 1));
                }
            }
        }
        //Response物件
        public class CompactResponse
        {
            //預設200, 404, 500三種回應
            public class HttpStatus
            {
                public static string Http200 = "200 OK";
                public static string Http404 = "404 Not Found";
                public static string Http500 = "500 Error";
            }
            public string StatusText = HttpStatus.Http200;
            public string ContentType = "text/plain";
            //可回傳Response Header
            public Dictionary<string, string> Headers
                = new Dictionary<string, string>();
            //傳回內容，以byte[]表示
            public byte[] Data = new byte[] { };
        }
        //簡陋但堪用的HTTP Server
        public class MicroHttpServer
        {
            private Thread serverThread;
            TcpListener listener;
            //呼叫端要準備一個函數，接收CompactRequest，回傳CompactResponse
            public MicroHttpServer(int port,
                Func<CompactRequest, CompactResponse> reqProc)
            {
                IPAddress ipAddr = IPAddress.Parse("127.0.0.1");
                listener = new TcpListener(ipAddr, port);
                //另建Thread執行
                serverThread = new Thread(() =>
                {
                    listener.Start();
                    while (true)
                    {
                        try
                        {
                            Socket s = listener.AcceptSocket();
                            NetworkStream ns = new NetworkStream(s);
                            //解讀Request內容
                            StreamReader sr = new StreamReader(ns);
                            CompactRequest req = new CompactRequest(sr);
                            //呼叫自訂的處理邏輯，得到要回傳的Response
                            CompactResponse resp = reqProc(req);
                            //傳回Response
                            StreamWriter sw = new StreamWriter(ns);
                            sw.WriteLine("HTTP/1.1 {0}", resp.StatusText);
                            sw.WriteLine("Content-Type: " + resp.ContentType);
                            foreach (string k in resp.Headers.Keys)
                                sw.WriteLine("{0}: {1}", k, resp.Headers[k]);
                            sw.WriteLine("Content-Length: {0}", resp.Data.Length);
                            sw.WriteLine();
                            sw.Flush();
                            //寫入資料本體
                            s.Send(resp.Data);
                            //結束連線
                            s.Shutdown(SocketShutdown.Both);
                            ns.Close();
                        }
                        catch { }
                    }
                });
                serverThread.Start();
            }
            public void Stop()
            {
                listener.Stop();
#pragma warning disable SYSLIB0006
                serverThread.Abort();
            }
        }

        static void Main(string[] args)
        {
            ArduinoWork.threadHandle(THREAD_MODE.START);
            MicroHttpServer mhs = new MicroHttpServer(1688,
            (req) =>
            {
                string response = "";
                if (req.Url != "/favicon.ico")
                {
                    response = ArduinoWork.SetMode(req.Url);
                    Console.WriteLine(req.Url);

                }
                return
                   new CompactResponse()
                   {
                       Data = Encoding.UTF8.GetBytes(response)
                   };
            });

            Console.WriteLine("Press any key to stop...");
            Console.Read();
            ArduinoWork.threadHandle(THREAD_MODE.STOP);
            mhs.Stop();
        }
    }

}
