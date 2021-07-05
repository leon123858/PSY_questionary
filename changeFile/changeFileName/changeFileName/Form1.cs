using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;
using ExcelDataReader;
using System.IO;

namespace changeFileName
{
    public partial class Form1 : Form
    {
        string excelPath = "";
        string pathOfFolder = "";
        public Form1()
        {
            InitializeComponent();
        }

        private void getExcelPathBtn_Click(object sender, EventArgs e)
        {
            if (openExcel.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    excelPath = openExcel.FileName;
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Security error.\n\nError message: {ex.Message}\n\n" +
                    $"Details:\n\n{ex.StackTrace}");
                    excelPath = "";
                }
                if(excelPath == "")
                {
                    preView.Enabled = false;
                    return;
                }
                preView.Enabled = true;
            }
        }

        private void preView_Click(object sender, EventArgs e)
        {
            MessageBox.Show(excelPath);
            //Process.Start()
            if (excelPath != "")
            {
                try
                {
                    Process.Start(@"cmd.exe ", @"/c " + excelPath);
                }
                catch(Exception ex)
                {
                    MessageBox.Show("預覽錯誤, 請自行檢查該路徑檔案。errMsg:" + ex);
                }
            }
        }

        private void sample_Click(object sender, EventArgs e)
        {
            Process.Start(@"cmd.exe ", @"/c " +@"sample.xlsx");
        }

        private void chooseFolderBtn_Click(object sender, EventArgs e)
        {
            if (chooseFolder.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    pathOfFolder = chooseFolder.SelectedPath;
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Security error.\n\nError message: {ex.Message}\n\n" +
                    $"Details:\n\n{ex.StackTrace}");
                    pathOfFolder = "";
                }
                if (pathOfFolder == "")
                {
                    folderPath.Text= "                     尚未存儲路徑                      ";
                    return;
                }
                folderPath.Text = pathOfFolder;
            }
        }

        private void confirmBtn_Click(object sender, EventArgs e)
        {
            if(textBox.Text == "")
            {
                MessageBox.Show("請輸入附檔名");
                return;
            }
            if(excelPath == ""|| pathOfFolder == "")
            {
                MessageBox.Show("請完成第一二步驟");
                return;
            }
            DataSet resultDataSet;
            try
            {
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                FileStream fStream = File.Open(excelPath, FileMode.Open, FileAccess.Read);
                IExcelDataReader excelDataReader = ExcelReaderFactory.CreateOpenXmlReader(fStream);
                resultDataSet = excelDataReader.AsDataSet();
                excelDataReader.Close();
            }catch(Exception err)
            {
                MessageBox.Show("xlsx檔案載入有誤, errMsg:" + err);
                return;
            }
            List<Task> taskList = new List<Task>();
            for(int i = 0; i < resultDataSet.Tables[0].Rows.Count; i++)
            {
                string sourceName = resultDataSet.Tables[0].Rows[i][0].ToString();
                string disName = resultDataSet.Tables[0].Rows[i][1].ToString();
                taskList.Add(Task.Run(() => {
                    try
                    {
                        File.Move($"{pathOfFolder}\\{sourceName}.{textBox.Text}" , $"{pathOfFolder}\\{disName}.{textBox.Text}");
                    }
                    catch (Exception err)
                    {
                        MessageBox.Show(err.Message);
                        throw;
                    }
                }));
            }
            Task allTask = Task.WhenAll(taskList);
            try
            {
                allTask.Wait();
            }
            catch { }

            if (allTask.Status == TaskStatus.RanToCompletion)
                MessageBox.Show("success!");
            else if (allTask.Status == TaskStatus.Faulted)
                MessageBox.Show("something wrong");
        }

        private void getFiles_Click(object sender, EventArgs e)
        {
            if(pathOfFolder == "")
            {
                MessageBox.Show("請選擇目標資料夾");
                return;
            }
            DirectoryInfo dir = new DirectoryInfo(pathOfFolder);
            using (var file = new StreamWriter("output.csv"))
            {
                foreach (var fi in dir.GetFiles())
                {
                    string str = "";
                    foreach(var v in fi.Name.Split("."))
                    {
                        str += v + ",";
                    }
                    file.WriteLine($"{str}");
                }
            }
            Process.Start(@"cmd.exe ", @"/c " + @"output.csv");
        }
    }
}
