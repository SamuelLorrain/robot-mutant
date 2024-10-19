import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";

window.addEventListener('load', () => {
  const context2dProvider = Context2DProvider.getInstance();

  const changeSizeObserver = new CanvasChangeSizeObserver();
  changeSizeObserver.observe(context2dProvider.canvas);

  const render = () => {

    context2dProvider.paintBackground();
    context2dProvider.updateCanvasSize(
      changeSizeObserver.width,
      changeSizeObserver.height
    );

    requestAnimationFrame(render);
  }

  render();
})


