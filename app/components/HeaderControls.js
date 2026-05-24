import HeaderControlsDesktop from './HeaderControlsDesktop';
import HeaderControlsMobile from './HeaderControlsMobile';

export default function HeaderControls(props) {
  return (
    <>
      <HeaderControlsMobile {...props} />
      <HeaderControlsDesktop {...props} />
    </>
  );
}
