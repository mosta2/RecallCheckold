if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");

    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{width:auto!important}"
        )
    );

    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{height:device-height!important}"
        )
    );

    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}