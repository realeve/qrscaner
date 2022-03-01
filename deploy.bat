echo off
color 0a 

rem 测试数据目录
set destDir=\\10.8.1.25\d$\wamp\ThinkPHP\public\nepal
set srcDir=.\dist
set fontsDir=\\10.8.1.25\d$\wamp\ThinkPHP\public\fonts
 
 rem remove files
 del %destDir%\*.js
 del %destDir%\*.css
 del %destDir%\*.html
 
xcopy %srcDir% %destDir%  /E /Y /F
 
copy %srcDir%\fonts\*.* %fontsDir%  

pause