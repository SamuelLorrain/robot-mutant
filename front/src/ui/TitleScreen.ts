import conf from '@/configuration';

export class TitleScreen {
  private readonly _titleScreenContainer: HTMLDivElement;
  private readonly _titleScreenStartButton: HTMLButtonElement;
  private _started: boolean;

  constructor() {
    this._titleScreenContainer = document.querySelector(conf.splashScreen.querySelector) as HTMLDivElement;
    this._titleScreenStartButton = this._titleScreenContainer.querySelector("button") as HTMLButtonElement;
    this._started = false;
    this._initUi();
  }

  private _initUi() {
    this._titleScreenStartButton.onclick = () => {
      this._started = true;
      this._hideTitleScreen();
    }
    this._displayTitleScreen();
  }

  private _displayTitleScreen() {
    this._titleScreenContainer.style.top = "50px";
    this._titleScreenContainer.style.left = "200px";
  }

  private _hideTitleScreen() {
    this._titleScreenContainer.style.display= "none";
  }

  public get started() {
    return this._started;
  }
}
