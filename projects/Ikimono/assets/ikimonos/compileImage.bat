cd %~dp0
echo %%1
set /p id=Enter Ikimono Name: 

xcopy "%~2" "%cd%\%id%\front.png*" /K /D /H /Y
xcopy "%~1" "%cd%\%id%\back.png*" /K /D /H /Y

xcopy "%~2" "%cd%\%id%-shiny\front.png*" /K /D /H /Y
xcopy "%~1" "%cd%\%id%-shiny\back.png*" /K /D /H /Y

del "%~1"
del "%~2"