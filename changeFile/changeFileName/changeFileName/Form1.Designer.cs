
namespace changeFileName
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.openExcel = new System.Windows.Forms.OpenFileDialog();
            this.chooseFolder = new System.Windows.Forms.FolderBrowserDialog();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.sample = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.getExcelPathBtn = new System.Windows.Forms.Button();
            this.chooseFolderBtn = new System.Windows.Forms.Button();
            this.confirmBtn = new System.Windows.Forms.Button();
            this.preView = new System.Windows.Forms.Button();
            this.folderPath = new System.Windows.Forms.Label();
            this.textBox = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.getFiles = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // openExcel
            // 
            this.openExcel.FileName = "openFileDialog";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft JhengHei UI", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label1.Location = new System.Drawing.Point(358, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(164, 46);
            this.label1.TabIndex = 0;
            this.label1.Text = "使用說明";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft JhengHei UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label2.Location = new System.Drawing.Point(23, 96);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(811, 30);
            this.label2.TabIndex = 1;
            this.label2.Text = "1. 上傳excel檔,第一columns為要改名的檔案, 第二columns為要改成的名子";
            // 
            // sample
            // 
            this.sample.Font = new System.Drawing.Font("Microsoft JhengHei UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.sample.Location = new System.Drawing.Point(78, 259);
            this.sample.Name = "sample";
            this.sample.Size = new System.Drawing.Size(189, 44);
            this.sample.TabIndex = 2;
            this.sample.Text = "excel sample";
            this.sample.UseVisualStyleBackColor = true;
            this.sample.Click += new System.EventHandler(this.sample_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft JhengHei UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label3.Location = new System.Drawing.Point(23, 151);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(399, 30);
            this.label3.TabIndex = 3;
            this.label3.Text = "2. 選擇哪個資料夾裡面的檔案要改名";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Microsoft JhengHei UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.label4.Location = new System.Drawing.Point(23, 206);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(865, 30);
            this.label4.TabIndex = 4;
            this.label4.Text = "3. 確認步驟1.2無誤, 點擊確認, 若預覽檔案無法順利運行可以試著把檔名改成英文";
            // 
            // getExcelPathBtn
            // 
            this.getExcelPathBtn.Font = new System.Drawing.Font("Microsoft JhengHei UI", 16F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.getExcelPathBtn.Location = new System.Drawing.Point(78, 327);
            this.getExcelPathBtn.Name = "getExcelPathBtn";
            this.getExcelPathBtn.Size = new System.Drawing.Size(189, 102);
            this.getExcelPathBtn.TabIndex = 5;
            this.getExcelPathBtn.Text = "上傳excel";
            this.getExcelPathBtn.UseVisualStyleBackColor = true;
            this.getExcelPathBtn.Click += new System.EventHandler(this.getExcelPathBtn_Click);
            // 
            // chooseFolderBtn
            // 
            this.chooseFolderBtn.Font = new System.Drawing.Font("Microsoft JhengHei UI", 16F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.chooseFolderBtn.Location = new System.Drawing.Point(362, 327);
            this.chooseFolderBtn.Name = "chooseFolderBtn";
            this.chooseFolderBtn.Size = new System.Drawing.Size(189, 102);
            this.chooseFolderBtn.TabIndex = 6;
            this.chooseFolderBtn.Text = "選擇資料夾";
            this.chooseFolderBtn.UseVisualStyleBackColor = true;
            this.chooseFolderBtn.Click += new System.EventHandler(this.chooseFolderBtn_Click);
            // 
            // confirmBtn
            // 
            this.confirmBtn.Font = new System.Drawing.Font("Microsoft JhengHei UI", 16F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.confirmBtn.Location = new System.Drawing.Point(630, 327);
            this.confirmBtn.Name = "confirmBtn";
            this.confirmBtn.Size = new System.Drawing.Size(189, 102);
            this.confirmBtn.TabIndex = 7;
            this.confirmBtn.Text = "確認執行";
            this.confirmBtn.UseVisualStyleBackColor = true;
            this.confirmBtn.Click += new System.EventHandler(this.confirmBtn_Click);
            // 
            // preView
            // 
            this.preView.Enabled = false;
            this.preView.Font = new System.Drawing.Font("Microsoft JhengHei UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.preView.Location = new System.Drawing.Point(78, 452);
            this.preView.Name = "preView";
            this.preView.Size = new System.Drawing.Size(189, 40);
            this.preView.TabIndex = 8;
            this.preView.Text = "預覽檔案";
            this.preView.UseVisualStyleBackColor = true;
            this.preView.Click += new System.EventHandler(this.preView_Click);
            // 
            // folderPath
            // 
            this.folderPath.AutoSize = true;
            this.folderPath.Location = new System.Drawing.Point(295, 463);
            this.folderPath.Name = "folderPath";
            this.folderPath.Size = new System.Drawing.Size(333, 23);
            this.folderPath.TabIndex = 9;
            this.folderPath.Text = "                     尚未存儲路徑                      ";
            // 
            // textBox
            // 
            this.textBox.Location = new System.Drawing.Point(630, 273);
            this.textBox.Name = "textBox";
            this.textBox.PlaceholderText = "請輸入附檔名,ex:mp4";
            this.textBox.Size = new System.Drawing.Size(189, 30);
            this.textBox.TabIndex = 10;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(499, 541);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(86, 23);
            this.label5.TabIndex = 11;
            this.label5.Text = "額外功能:";
            // 
            // getFiles
            // 
            this.getFiles.Location = new System.Drawing.Point(591, 535);
            this.getFiles.Name = "getFiles";
            this.getFiles.Size = new System.Drawing.Size(300, 34);
            this.getFiles.TabIndex = 12;
            this.getFiles.Text = "獲取選擇資料夾的所有檔名";
            this.getFiles.UseVisualStyleBackColor = true;
            this.getFiles.Click += new System.EventHandler(this.getFiles_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(11F, 23F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(903, 592);
            this.Controls.Add(this.getFiles);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.textBox);
            this.Controls.Add(this.folderPath);
            this.Controls.Add(this.preView);
            this.Controls.Add(this.confirmBtn);
            this.Controls.Add(this.chooseFolderBtn);
            this.Controls.Add(this.getExcelPathBtn);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.sample);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Name = "Form1";
            this.Text = "大量變更檔名";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.OpenFileDialog openExcel;
        private System.Windows.Forms.FolderBrowserDialog chooseFolder;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button sample;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button getExcelPathBtn;
        private System.Windows.Forms.Button chooseFolderBtn;
        private System.Windows.Forms.Button confirmBtn;
        private System.Windows.Forms.Button preView;
        private System.Windows.Forms.Label folderPath;
        private System.Windows.Forms.TextBox textBox;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Button getFiles;
    }
}

