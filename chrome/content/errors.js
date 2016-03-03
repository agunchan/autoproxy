try {
    let aup = Components.classes["@mozilla.org/autoproxy;1"].createInstance().wrappedJSObject;
    let text = "You are running AutoProxy " + aup.getInstalledVersion();
    let build = aup.getInstalledBuild();
    if (build)
        text += ", build " + build;
    text += ".";
    document.documentElement.appendChild("<p>" + text + "</p>");
} catch (e) {}

let messages = {};
    Components.classes["@mozilla.org/consoleservice;1"]
.getService(Components.interfaces.nsIConsoleService)
    .getMessageArray(messages, {});
    messages = messages.value || [];

messages = messages.filter(function(message)
        {
        return (message instanceof Components.interfaces.nsIScriptError &&
                (/AutoProxy/i.test(message.errorMessage) || /AutoProxy/i.test(message.sourceName)));
        });

if (messages.length)
{
    document.documentElement.appendChild("<p>Errors related to AutoProxy:</p>");
    for each (let message in messages)
    {
        let type = (message.flags & Components.interfaces.nsIScriptError.warningFlag ? "warning" : "error");
        let html = "<b>" + (type == "warning" ? "Warning:" : "Error:") + "</b><br>";
        html += encodeHTML(message.errorMessage) + "<br><br>";
        if (message.sourceLine)
            html += "Source line: " + encodeHTML(message.sourceLine) + "<br>";
        if (message.sourceName)
            html += "Location: " + encodeHTML(message.sourceName) + " line " + message.lineNumber + "<br>";
        html = html.replace(/(<br>)+$/, "");
        document.documentElement.appendChild("<div class='" + type + "'>" +
                html +
                "</div>");
    }
}
else
{
    document.documentElement.appendChild("<p>No errors found.</p>");
}

function encodeHTML(string)
{
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clearErrors()
{
    Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService)
        .reset();
    window.location.reload();
}
