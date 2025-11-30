const rrwebURL = "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js";
let events = [];

rrweb.record({
  maskAllInputs: true,
  maskInputOptions: {
    password: true,
    email: true,
    textarea: true,
  },
  emit(event) {
    events.push(event);
  },
});

// Send events to backend on unload
window.addEventListener("beforeunload", () => {
  navigator.sendBeacon("/track-session", JSON.stringify(events));
});

{
  /* <div id="replay" style="height: 600px;"></div>
<script src="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/index.js"></script>
<link href="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/style.css" rel="stylesheet"/>

<script>
  fetch('/get-events?session_id=abc-123')
    .then(res => res.json())
    .then(events => {
      new rrwebPlayer({
        target: document.getElementById('replay'),
        props: {
          events,
          showDebug: false,
        }
      });
    });
</script> */
}
