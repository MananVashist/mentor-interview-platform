@echo off
rem Launched at logon by the CrackJobsFeedbackWorker scheduled task.
rem Listens for 100ms transcript-ready webhooks and writes AI feedback with the Claude CLI.
if not exist "%LOCALAPPDATA%\crackjobs" mkdir "%LOCALAPPDATA%\crackjobs"
cd /d E:\crackjobs
"C:\Program Files\nodejs\node.exe" scripts\feedback-worker.mjs >> "%LOCALAPPDATA%\crackjobs\feedback-worker.log" 2>&1
