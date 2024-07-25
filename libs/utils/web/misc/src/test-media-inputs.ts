import { isMobile } from './is-mobile';

export {
  testAllMediaInputs,
  testCameraInputs
};

//////////////////////

async function hasCameraAccess(ua: string): Promise<boolean> {
  const isIE = ua.indexOf('MSIE ') > -1;

  if (isIE) {
    return false;
  }

  // Determine enumerateDrives() is supported
  const canDetect =
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.enumerateDevices === 'function';

  if (!canDetect) {
    return false;
  }

  const hasWebCam = await navigator.mediaDevices.enumerateDevices().then((devices) => {
    return devices.some(d => d.kind === 'videoinput');
  });

  return hasWebCam;
}

async function cameraNotBlocked() {
  const constraint = { video: true };
  try {
    const media = await navigator.mediaDevices.getUserMedia(constraint);
    return media.active;
  } catch (e) {
    throw e;
  }
}

async function audioNotBlocked() {
  const constraint = { audio: true };
  try {
    const media = await navigator.mediaDevices.getUserMedia(constraint);
    return media.active;
  } catch (e) {
    throw e;
  }
}

async function testAllMediaInputs() {
  const ua = window.navigator.userAgent;
  const mediaInputs = {
    isMobile: isMobile(),
    userAgent: ua,
    hasCamera: false,
    cameraEnabled: false,
    audio: false
  };

  try {
    // Camera Tests
    const accessToCamera = await hasCameraAccess(ua);
    if (accessToCamera) {
      mediaInputs.hasCamera = true;
    }
    const camNotBlocked = await cameraNotBlocked();
    if (camNotBlocked) {
      mediaInputs.cameraEnabled = true;
    }

    // Audio Test
    const micNotBlocked = await audioNotBlocked();
    if (micNotBlocked) {
      mediaInputs.audio = true;
    }

  } catch (e) {
    console.log(e.name);
    try {
      const micNotBlocked = await audioNotBlocked();
      if (micNotBlocked) {
        mediaInputs.audio = true;
      }
    } catch (e) {
      console.log(e.name);
    }
  }

  return mediaInputs;
}

async function testCameraInputs() {
  const ua = window.navigator.userAgent;
  const mediaInputs = {
    isMobile: isMobile(),
    userAgent: ua,
    hasCamera: false,
    cameraEnabled: false
  };

  try {
    // Camera Tests
    const accessToCamera = await hasCameraAccess(ua);
    if (accessToCamera) {
      mediaInputs.hasCamera = true;
    }
    const camNotBlocked = await cameraNotBlocked();
    if (camNotBlocked) {
      mediaInputs.cameraEnabled = true;
    }

  } catch (e) {
    console.log(e.name);
  }

  return mediaInputs;
}
