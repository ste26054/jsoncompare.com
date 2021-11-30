import { prop } from 'seemple/binders';
import style from '../style.css';

export default ({ owner }) => (
    <div className={style.settings}>
        <button
            type="button"
            onClick={() => owner.onClickFullscreen()}
            className={style.fullscreenButton}
            bind={{
                owner,
                fullscreen: {
                    getValue: null,
                    setValue(value, { node }) {
                    // eslint-disable-next-line no-param-reassign
                        node.textContent = value ? 'Exit Fullscreen' : 'Fullscreen Editor';
                    }
                }
            }}
        />
    </div>
);
