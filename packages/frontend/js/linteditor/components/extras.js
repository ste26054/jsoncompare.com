import { className, html } from 'seemple/binders';
import style from '../style.css';

export default ({ owner }) => (
    <div>
        <div
            className={style.lintNotifier}
            bind={{
                owner,
                errorText: html()
            }}
        />
    </div>
);
