var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { toastDefault } from "./constants";
import { toastStyle } from "./style";
var style = document.createElement('style');
style.innerHTML = toastStyle;
document.head.appendChild(style);
var intervalId = null;
function fadeOut(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = "" + op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}
function infade(element) {
    var op = 0.1; // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = "" + op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}
function displayToast(_a) {
    var toastElement = _a.toastElement, options = _a.options;
    toastElement.style.display = "none";
    infade(toastElement);
    if (options.timeOut > 0) {
        intervalId = setTimeout(function () {
            fadeOut(toastElement);
        }, options.timeOut);
    }
}
function setSequence(_a) {
    var options = _a.options, toastElement = _a.toastElement, container = _a.container;
    if (options.newestOnTop) {
        container.prepend(toastElement);
    }
    else {
        container.appendChild(toastElement);
    }
}
function setTitle(_a) {
    var toastObj = _a.toastObj, titleElement = _a.titleElement, toastElement = _a.toastElement, options = _a.options;
    if (toastObj.title) {
        var suffix = toastObj.title;
        var att = document.createAttribute("class"); // Create a "class" attribute
        att.value = options.titleClass; // Set the value of the class attribute
        titleElement.setAttributeNode(att);
        titleElement.innerHTML = suffix.toString();
        toastElement.appendChild(titleElement);
    }
}
function setMessage(_a) {
    var toastObj = _a.toastObj, messageElement = _a.messageElement, toastElement = _a.toastElement, options = _a.options;
    if (toastObj.message) {
        var att = document.createAttribute("class"); // Create a "class" attribute
        att.value = options.messageClass; // Set the value of the class attribute
        messageElement.setAttributeNode(att);
        messageElement.innerHTML = toastObj.message;
        toastElement.appendChild(messageElement);
    }
}
function createContainer(options) {
    var div = document.createElement("div");
    var att = document.createAttribute("id"); // Create a "id" attribute
    att.value = options.containerId;
    var classAtt = document.createAttribute("class"); // Create a "id" attribute
    classAtt.value = options.position;
    div.setAttributeNode(att);
    div.setAttributeNode(classAtt);
    document.body.appendChild(div);
    return div;
}
function getContainer(options, create) {
    if (!options) {
        options = __assign({}, toastDefault);
    }
    var container = document.getElementById(options.containerId);
    if (container) {
        return container;
    }
    if (create) {
        container = createContainer(options);
    }
    return container;
}
function show(toastObj) {
    var options = __assign(__assign({}, toastDefault), toastObj);
    var iconClass = toastObj.type || options.iconClass;
    var container = getContainer(options, true);
    var toastElement = document.createElement("div");
    var titleElement = document.createElement("div");
    var messageElement = document.createElement("div");
    if (iconClass) {
        var att = document.createAttribute("class"); // Create a "class" attribute
        att.value = options.titleClass; // Set the value of the class attribute
        toastElement.setAttributeNode(att);
        toastElement.classList.add(options.toastClass);
        toastElement.classList.add(iconClass);
    }
    setTitle({ toastObj: toastObj, titleElement: titleElement, toastElement: toastElement, options: options });
    setMessage({ toastObj: toastObj, messageElement: messageElement, toastElement: toastElement, options: options });
    setSequence({ container: container, toastElement: toastElement, options: options });
    displayToast({ toastElement: toastElement, options: options });
    return "Displaying: " + toastObj.message;
}
export var toast = { show: show };
//# sourceMappingURL=index.js.map