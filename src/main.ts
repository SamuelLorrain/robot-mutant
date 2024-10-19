import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';

window.addEventListener('load', () => {
  const context2dProvider = Context2DProvider.getInstance();

  const render = () => {
    context2dProvider.paintBackground();
    requestAnimationFrame(render);
  }

  render();
})


