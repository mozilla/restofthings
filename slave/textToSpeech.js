var argv = process.argv;
console.log("text to process ***************", argv[2]);
var spawn = require('child_process').spawn,
  echo    = spawn('echo', [argv[2]]),
  festival  = spawn('festival', ['--tts']);

echo.stdout.on('data', function (data) {
  festival.stdin.write(data);
});

echo.stderr.on('data', function (data) {
  console.log('echo stderr: ' + data);
});

echo.on('close', function (code) {
  if (code !== 0) {
    console.log('echo process exited with code ' + code);
  }
  festival.stdin.end();
});

festival.stdout.on('data', function (data) {
  console.log('' + data);
});

festival.stderr.on('data', function (data) {
  console.log('festival stderr: ' + data);
});

festival.on('close', function (code) {
  if (code !== 0) {
    console.log('festival process exited with code ' + code);
  }
});