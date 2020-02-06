# cppcheckcmd

## Features

1. Run cppcheck for the current cpp file in editor
2. Get all the issues with higher severity than the setting
3. Run cppcheck for the cpp files in the folder of current file
4. Each change on current file will trigger the execution of cppcheck for the file.
5. Output cppcheck results in CppcheckReport channel of Output window


## Requirements

Please install cppcheck tool on OS first!!!
website is http://cppcheck.sourceforge.net/
All the cppcheck reports are dependent on execution of cppcheck executable file.


## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `cppcheck.isEnable`: enable/disable this extension
* `cppcheck.severity`: set to `error`, `warning`,`style`,`performance`,`portability`, or `information`. 

## Known Issues

## Release Notes

### 0.0.1
Initial release of cppcheckext

### 0.0.2
Get all the issues with higher severity than the setting

## Contact
If you have any issues report them at [Issues](https://github.com/RonZhong2009/vscode_cppcheck_extension/issues)

## License
Copyright (C) 2019 Ron Zhong
Licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Source
[GitHub](https://github.com/RonZhong2009/vscode_cppcheck_extension "https://github.com/RonZhong2009/vscode_cppcheck_extension")