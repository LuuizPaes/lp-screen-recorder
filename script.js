$(document).ready(function () {
  let recorder;
  let recordedBlob;

  $("#startRecording").click(function () {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        recorder = new RecordRTC(stream, {
          type: "video",
          mimeType: "video/webm",
        });

        recorder.startRecording();

        $("#startRecording").prop("disabled", true);
        $("#stopRecording").prop("disabled", false);
        $("#downloadRecording").prop("disabled", true);
      })
      .catch(function (error) {
        console.error("Erro ao acessar a tela:", error);
      });
  });

  $("#stopRecording").click(function () {
    recorder.stopRecording(function () {
      recordedBlob = recorder.getBlob();
      let videoURL = URL.createObjectURL(recordedBlob);

      $("#recordedVideo").attr("src", videoURL);

      $("#startRecording").prop("disabled", false);
      $("#stopRecording").prop("disabled", true);
      $("#downloadRecording").prop("disabled", false);
    });
  });

  $("#downloadRecording").click(function () {
    if (!recordedBlob) {
      console.error("Nenhum vídeo gravado disponível.");
      return;
    }

    let blobUrl = URL.createObjectURL(recordedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = "gravacao.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(blobUrl);
  });
});
