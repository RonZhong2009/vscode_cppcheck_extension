# cppcheckcmd

## Features

1. run cppcheck for the current cpp file in editor
2. get the specified severity issues found by cppcheck
3. run cppcheck for the cpp files in the fold of current file
4. each change on current file will trigger the execution of cppcheck for the file.
5. output cppcheck results in CppcheckReport channel of Output window


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

first release
### 0.0.1

Initial release of cppcheckext

