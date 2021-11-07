class Msdkv5Helper {
  public closeWebview() {
    if (this.isIOS()) {
      (window as any).msdkiOSHandler('MSDKCall', this.getCloseWebviewKey(), null);
    } else {
      prompt(this.getCloseWebviewKey());
    }
  }

  public setFullScreen() {
    if (this.isIOS()) {
      (window as any).msdkiOSHandler('MSDKCall', this.getFullScreenKey(), null);
    } else {
      prompt(this.getFullScreenKey());
    }
  }

  public exitFullScreen() {
    (window as any).isBackEntry = true;
    if (this.isIOS()) {
      (window as any).msdkiOSHandler('MSDKCall', this.getExitFullScreenKey(), null);
    } else {
      prompt(this.getExitFullScreenKey());
    }
  }

  private getCloseWebviewKey() {
    return '{"MsdkMethod":"closeWebView"}';
  }

  private getFullScreenKey() {
    return '{"MsdkMethod":"setFullScreen","isFullScreen":true}';
  }

  private getExitFullScreenKey() {
    return '{"MsdkMethod":"setFullScreen","isFullScreen":false}';
  }

  private isIOS() {
    return (
      (/iPad|iPhone|iPod/.test(navigator.platform)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
      && !window.MSStream
    );
  }
}

const msdkV5 = new Msdkv5Helper();

export default msdkV5;
