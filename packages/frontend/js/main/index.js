import Seemple from 'seemple/seemple';
import { dataset } from 'seemple/binders';
import initRouter from 'seemple-router';
import beautify from 'js-beautify/js/lib/beautify';
import minify from 'jsonminify';
import qs from 'qs';
import jsonabc from 'jsonabc';
import LintEditor from '../linteditor';
import Sandbox from './components/sandbox';
import Tabs from './tabs';

export default class Main extends Seemple {
    constructor() {
        initRouter(super(), 'mode/params')
            .instantiate('tabs', Tabs)
            .set({
                memo: {},
                mode: 'diff',
                defaultView: this.toJSONString(),
                saved: true,
                loading: true
            })
            .calc({
                id: {
                    source: 'params',
                    handler: (params) => (qs.parse(params).id || null)
                },
                fullscreen: {
                    source: 'params',
                    handler: (params) => 'fullscreen' in qs.parse(params)
                },
                params: {
                    source: ['id', 'fullscreen'],
                    handler(id, fullscreen) {
                        const params = [];

                        if (id) {
                            params.push(`id=${id}`);
                        }

                        if (fullscreen) {
                            params.push('fullscreen');
                        }

                        return params.join('&');
                    }
                }
            })
            .bindSandbox(<Sandbox owner={this} />)
            .bindNode('win', window)
            .bindNode('mode', 'body', dataset('mode'))
            .bindNode('fullscreen', 'body', {
                setValue(value, { node }) {
                    // eslint-disable-next-line no-param-reassign
                    node.dataset.fullscreen = value ? 'on' : 'off';
                }
            })
            .on({
                'tabs@change:activeTab': (evt) => {
                    this.mode = evt.value.name;
                }
            })
            .on('change:mode', () => {
                this.tabs[this.mode].isActive = true;
            }, true)
            .onDebounce({
                'tabs.*@modify': () => {
                    const currentView = this.toJSONString();
                    this.saved = this.defaultView === currentView
                        || this.memo[this.id] === currentView;
                }
            }, 500);

        document.querySelector('main').appendChild(this.nodes.sandbox);

        this.loading = false;

        Seemple.on(LintEditor, {
            lint: (instance) => {
                let { code } = instance;

                code = beautify.js_beautify(code, {
                    indent_size: 2
                });

                instance.set({ code }, {
                    fromReformat: true
                });
            },
            lintRemoteStart: () => {
                this.loading = true;
            },
            lintRemoteEnd: () => {
                this.loading = false;
            }
        });
    }

    onClickFullscreen() {
        this.fullscreen = !this.fullscreen;
    }

    error(errorText) {
        clearTimeout(this.errorTimeout);
        this.errorText = errorText;
        this.errorTimeout = setTimeout(() => {
            this.errorText = '';
        }, 5000);
    }

    toJSONString() {
        const data = {};
        this.tabs.each((tab, name) => {
            data[name] = tab.toJSON();
        });

        return JSON.stringify(data);
    }

    fromJSONString(str) {
        const data = JSON.parse(str);

        this.tabs.each((tab, name) => {
            tab.fromJSON(typeof data[name] === 'undefined' ? null : data[name]);
        });

        return this;
    }
}
