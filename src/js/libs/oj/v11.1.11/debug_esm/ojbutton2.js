/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { recentTouchEnd, makeFocusable, getNoJQFocusHandlers } from 'ojs/ojdomutils';
import { startDetectContextMenuGesture, stopDetectContextMenuGesture } from 'ojs/ojgestureutils';
import { getUniqueId, Root, customElement } from 'ojs/ojvcomponent';
import { Component, createRef, h } from 'preact';
import { VMenu } from 'ojs/ojvmenu';
import 'ojs/ojvcomponent-binding';
import { getCachedCSSVarValues } from 'ojs/ojthemeutils';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Button2_1;
function getChromingDefault() {
    return getCachedCSSVarValues(['--oj-private-button-global-chroming-default'])[0];
}
let Button2 = Button2_1 = class Button2 extends Component {
    constructor(props) {
        super(props);
        this._rootRef = createRef();
        this._handleContextMenuGesture = (event, eventType) => {
            const contextMenuEvent = {
                event: event,
                eventType: eventType
            };
            event.preventDefault();
            this.setState({ contextMenuTriggerEvent: contextMenuEvent });
        };
        this._handleTouchstart = (event) => {
            this.setState({ active: true });
        };
        this._handleTouchend = (event) => {
            this.setState({ active: false });
        };
        this._handleFocusIn = (event) => {
            this.setState({ focus: true });
            if (this._rootRef.current) {
                this.focusInHandler(this._rootRef.current);
            }
        };
        this._handleFocusOut = (event) => {
            this.setState({ focus: false });
            if (this._rootRef.current) {
                this.focusOutHandler(this._rootRef.current);
            }
        };
        this._handleMouseenter = (event) => {
            if (!recentTouchEnd()) {
                if (this === Button2_1._lastActive) {
                    this.setState({ active: true });
                }
                this.setState({ hover: true });
            }
        };
        this._handleMouseleave = (event) => {
            this.setState({ hover: false, active: false });
        };
        this._handleMousedown = (event) => {
            if (event.which === 1 && !recentTouchEnd()) {
                this.setState({ active: true });
                Button2_1._lastActive = this;
                const docMouseupListener = () => {
                    Button2_1._lastActive = null;
                    document.removeEventListener('mouseup', docMouseupListener, true);
                };
                document.addEventListener('mouseup', docMouseupListener, true);
            }
        };
        this._handleMouseup = (event) => {
            this.setState({ active: false });
        };
        this._handleClick = (event) => {
            var _a, _b;
            if (event.detail <= 1) {
                (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
            }
        };
        this._handleKeydown = (event) => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.setState({ active: true });
            }
        };
        this._handleKeyup = (event) => {
            this.setState({ active: false });
        };
        this._handleFocus = (event) => {
            var _a, _b;
            (_b = (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
        };
        this._handleBlur = (event) => {
            var _a;
            this.setState({ active: false });
            (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.current.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
        };
        this._onCloseCallback = (event) => {
            if (this.state.contextMenuTriggerEvent) {
                this.setState({ contextMenuTriggerEvent: null });
            }
        };
        this.state = {};
        this.uniquePrefix = props.id ? props.id + getUniqueId() : getUniqueId();
    }
    render(props, state) {
        const defaultSlot = props.children;
        const startIconContent = this._processIcon(props.startIcon, 'oj-button-icon oj-start');
        const endIconContent = this._processIcon(props.endIcon, 'oj-button-icon oj-end');
        let ariaLabel = props['aria-label'];
        let ariaLabelledBy = props['aria-labelledby'];
        const hasDefaultAriaAttribute = ariaLabel || ariaLabelledBy;
        let defaultContent = null;
        let clickHandler = null;
        let ariaLabelledById = null;
        let title = props.title;
        const buttonLabel = props.label || defaultSlot;
        if (buttonLabel) {
            title = this.state.derivedTitle || title || props.label;
            if (props.display === 'icons' && (startIconContent || endIconContent)) {
                if (props.label) {
                    if (!hasDefaultAriaAttribute) {
                        ariaLabel = props.label;
                    }
                }
                else {
                    if (!hasDefaultAriaAttribute) {
                        ariaLabelledById = this.uniquePrefix + '|text';
                        ariaLabelledBy = ariaLabelledById;
                    }
                    defaultContent = (h("span", { class: 'oj-button-text oj-helper-hidden-accessible', id: ariaLabelledById }, buttonLabel));
                }
            }
            else {
                if (!hasDefaultAriaAttribute) {
                    ariaLabelledById = this.uniquePrefix + '|text';
                    ariaLabelledBy = ariaLabelledById;
                }
                defaultContent = (h("span", { class: 'oj-button-text', id: ariaLabelledById }, buttonLabel));
            }
        }
        defaultContent = (h("span", { ref: (elem) => (this._defaultSlotRef = elem) }, defaultContent));
        const labelContent = (h("div", { class: 'oj-button-label' },
            startIconContent,
            defaultContent,
            endIconContent));
        let buttonContent;
        if (props.disabled) {
            buttonContent = (h("button", { class: 'oj-button-button', "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, disabled: true }, labelContent));
        }
        else {
            clickHandler = this._handleClick;
            buttonContent = (h("button", { class: 'oj-button-button', ref: (elem) => (this._buttonRef = elem), "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, onTouchStart: this._handleTouchstart, onTouchEnd: this._handleTouchend, onTouchCancel: this._handleTouchend, onMouseEnter: this._handleMouseenter, onMouseLeave: this._handleMouseleave, onMouseDown: this._handleMousedown, onMouseUp: this._handleMouseup, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut, onKeyDown: this._handleKeydown, onKeyUp: this._handleKeyup, onFocus: this._handleFocus, onBlur: this._handleBlur }, labelContent));
        }
        const rootClasses = this._getRootClasses(startIconContent, endIconContent);
        return (h(Root, { class: rootClasses, id: props.id, title: title, onClick: clickHandler, ref: this._rootRef },
            buttonContent,
            this._renderContextMenu()));
    }
    _renderContextMenu() {
        if (!this.state.contextMenuTriggerEvent || !this.props.contextMenu) {
            return null;
        }
        return (h(VMenu, { eventObj: this.state.contextMenuTriggerEvent, launcherElement: this._buttonRef, onCloseCallback: this._onCloseCallback }, [this.props.contextMenu]));
    }
    _processIcon(icon, slotClass) {
        let iconContent;
        if (Array.isArray(icon)) {
            iconContent = icon.map((elem) => {
                return this._processIcon(elem, slotClass);
            });
        }
        else if (icon) {
            iconContent = h("span", { class: slotClass }, icon);
        }
        return iconContent;
    }
    _getRootClasses(startIconContent, endIconContent) {
        let defaultState = true;
        let classList = 'oj-button ' + Button2_1._chromingMap[this.props.chroming];
        classList += ' ' + this._getDisplayOptionClass(startIconContent, endIconContent);
        if (this.props.disabled) {
            defaultState = false;
            classList += ' oj-disabled';
        }
        else {
            classList += ' oj-enabled';
            if (this.state.hover) {
                defaultState = false;
                classList += ' oj-hover';
            }
            if (this.state.active) {
                defaultState = false;
                classList += ' oj-active';
            }
        }
        if (defaultState) {
            classList += ' oj-default';
        }
        return classList;
    }
    _getDisplayOptionClass(startIconContent, endIconContent) {
        const multipleIcons = startIconContent && endIconContent;
        const atLeastOneIcon = startIconContent || endIconContent;
        const displayIsIcons = this.props.display === 'icons';
        let buttonClass;
        if (atLeastOneIcon) {
            if (displayIsIcons) {
                if (multipleIcons) {
                    buttonClass = 'oj-button-icons-only';
                }
                else {
                    buttonClass = 'oj-button-icon-only';
                }
            }
            else if (multipleIcons) {
                buttonClass = 'oj-button-text-icons';
            }
            else if (startIconContent) {
                buttonClass = 'oj-button-text-icon-start';
            }
            else {
                buttonClass = 'oj-button-text-icon-end';
            }
        }
        else {
            buttonClass = 'oj-button-text-only';
        }
        return buttonClass;
    }
    _addMutationObserver() {
        if (this._mutationObserver) {
            return;
        }
        const config = {
            subtree: true,
            characterData: true
        };
        const callback = () => {
            const title = this._getTextContent();
            if (title != this.state.derivedTitle) {
                this.setState({ derivedTitle: title });
            }
        };
        this._mutationObserver = new MutationObserver(callback);
        this._mutationObserver.observe(this._defaultSlotRef, config);
    }
    _needsContextMenuDetection(props) {
        return props.contextMenu && !props.disabled;
    }
    componentDidMount() {
        this._updateDerivedTitle();
        if (this._needsContextMenuDetection(this.props)) {
            startDetectContextMenuGesture(this._rootRef.current, this._handleContextMenuGesture);
        }
        this._rootRef.current.addEventListener('touchstart', this._handleTouchstart, { passive: true });
        this._rootRef.current.addEventListener('touchend', this._handleTouchend, { passive: false });
        this._rootRef.current.addEventListener('touchcancel', this._handleTouchend, {
            passive: true
        });
        makeFocusable({
            applyHighlight: true,
            setupHandlers: (focusInHandler, focusOutHandler) => {
                let noJQHandlers = getNoJQFocusHandlers(focusInHandler, focusOutHandler);
                this.focusInHandler = noJQHandlers.focusIn;
                this.focusOutHandler = noJQHandlers.focusOut;
            }
        });
    }
    componentDidUpdate(oldProps) {
        if (oldProps.display != this.props.display) {
            this._updateDerivedTitle();
        }
        this._updateContextMenuDetection(oldProps);
    }
    _updateDerivedTitle() {
        const props = this.props;
        let title;
        if (props.display === 'icons' &&
            (props.startIcon || props.endIcon) &&
            !props.label &&
            !props.title) {
            title = this._getTextContent();
            this._addMutationObserver();
        }
        if (title != this.state.derivedTitle) {
            this.setState({ derivedTitle: title });
        }
    }
    _updateContextMenuDetection(oldProps) {
        const oldNeedsDetect = this._needsContextMenuDetection(oldProps);
        const newNeedsDetect = this._needsContextMenuDetection(this.props);
        if (oldNeedsDetect != newNeedsDetect) {
            if (newNeedsDetect) {
                startDetectContextMenuGesture(this._rootRef.current, this._handleContextMenuGesture);
            }
            else {
                stopDetectContextMenuGesture(this._rootRef.current);
            }
        }
    }
    static getDerivedStateFromProps(props) {
        if (props.disabled) {
            return { contextMenuTriggerEvent: null };
        }
        return null;
    }
    _getTextContent() {
        let content = this._defaultSlotRef.textContent;
        content = content.trim();
        if (content !== '') {
            return content;
        }
        return null;
    }
    componentWillUnmount() {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }
        stopDetectContextMenuGesture(this._rootRef.current);
    }
    refresh() {
        this.setState({ active: false });
    }
    focus() {
        var _a;
        (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.blur();
    }
};
Button2._chromingMap = {
    solid: 'oj-button-full-chrome',
    outlined: 'oj-button-outlined-chrome',
    borderless: 'oj-button-half-chrome',
    full: 'oj-button-full-chrome',
    half: 'oj-button-half-chrome',
    callToAction: 'oj-button-cta-chrome',
    danger: 'oj-button-danger-chrome oj-button-full-chrome'
};
Button2.defaultProps = {
    disabled: false,
    display: 'all',
    chroming: getChromingDefault()
};
Button2.metadata = { "slots": { "": {}, "startIcon": {}, "endIcon": {}, "contextMenu": {} }, "properties": { "disabled": { "type": "boolean" }, "display": { "type": "string", "enumValues": ["all", "icons"] }, "label": { "type": "string" }, "translations": { "type": "object|null" }, "chroming": { "type": "string", "enumValues": ["borderless", "callToAction", "danger", "full", "half", "outlined", "solid"], "binding": { "consume": { "name": "containerChroming" } } } }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["id", "title", "aria-label", "aria-labelledby"] }, "methods": { "refresh": {}, "focus": {}, "blur": {} } };
Button2 = Button2_1 = __decorate([
    customElement('oj-button')
], Button2);

export { Button2 };
