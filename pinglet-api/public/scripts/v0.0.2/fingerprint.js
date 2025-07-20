import FingerprintJS from "@fingerprintjs/fingerprintjs";

FingerprintJS.load().then(fp => {
  fp.get().then(result => {
    const visitorId = result.visitorId;

    fetch("/api/notifications", {
      headers: {
        "X-Project-ID": projectId,
        "X-Timestamp": timestamp,
        "X-Pinglet-Signature": signature,
        "X-Pinglet-Version": version,
        "X-Pinglet-Checksum": checksum,
        "X-Fingerprint": visitorId
      },
      body: JSON.stringify(payload)
    });
  });
});
