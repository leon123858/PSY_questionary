#include<iostream>
#include<vector>
#include<string>
#include <regex>
using namespace std;

int execmd(const char* cmd, string& result) {
	char buffer[128];                                         
	FILE* pipe = _popen(cmd, "r");          
	if (!pipe)
		return 0;                     
	while (!feof(pipe)) {
		if (fgets(buffer, 128, pipe)) {             
			result += buffer;
		}
	}
	_pclose(pipe);                          
	return 1;                               
}

void split(string& input,vector<string>& vec) {
	string buffer = "";
	for (int i = 0; i < input.length(); i++) {
		char newChar = input.at(i);
		if (newChar == '\n') {
			vec.push_back(buffer);
			buffer = "";
			continue;
		}
		buffer += newChar;
	}
}

void removeDir(vector<string>& vec) {
	for (int i = 0; i < vec.size(); i++) {
		int j;
		for ( j = 0; j < vec.at(i).size(); j++) {
			if (vec.at(i).at(j) == '.') {
				break;
			}
		}
		if(j == vec.at(i).size())
			vec.erase(vec.begin() + i);
	}
 }

int main() {
	cout << "this script is used to generate files name concat same directory, you just need to input directory path below, their will be a output.txt in this directory" << endl;
	cout << "input your real path" << endl;
	string directoryPath;
	cin >> directoryPath;
	cout << "input your web path" << endl;
	string webPath;
	cin >> webPath;

	string cmdStr = "dir " + directoryPath + " /b";
	string result = "";
	const char* cmd = cmdStr.c_str();
	execmd(cmd, result);
	vector<string> vec;
	split(result, vec);
	removeDir(vec);
	string output = "[";
	for (int i = 0; i < vec.size(); i++) {
		output += "\"" + webPath + vec.at(i) + "\",";
	}
	output += "]";
	cout<< endl << output << endl;
	system("PAUSE");
}