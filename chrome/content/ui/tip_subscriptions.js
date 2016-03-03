/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Adblock Plus.
 *
 * The Initial Developer of the Original Code is
 * Wladimir Palant.
 * Portions created by the Initial Developer are Copyright (C) 2006-2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * 2009: Wang Congming <lovelywcm@gmail.com> Modified for AutoProxy.
 *
 * ***** END LICENSE BLOCK ***** */

let autoAdd;
let result;
let defaultLabel;
let menupop;
let selectedId;
let E = function(id) { return document.getElementById(id); };
let cE = function(tag) { return document.createElementNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", tag); };

function init()
{
  autoAdd = !(window.arguments && window.arguments.length);
  result = (autoAdd ? {disabled: false, external: false, autoDownload: true} : window.arguments[0]);
  E("description-par1").hidden = !autoAdd;
  E("description-par3").hidden = !autoAdd;
  if (!autoAdd) {
    E("description-par2").style.visibility = "hidden";
    E("defaultButton").style.visibility = "hidden";
    E("acceptButton").label = E("acceptButton").getAttribute("label2");
    E("acceptButton").setAttribute("accesskey", E("acceptButton").getAttribute("accesskey2"));
  }
  else{
    E("aupTipSubscriptions").width = "600px";
    document.title = E("aupTipSubscriptions").getAttribute("welcome");
    defaultLabel = E("defaultButton").label;
    menupop = E("defaultButton").firstChild;
    createMenuItems();
  }
}

/**
 * Create menu items for user to choose a default proxy.
 * Re-create these items if user customed a new proxy.
 */
function createMenuItems()
{
  selectedId = prefs.defaultProxy;

  for (let i in proxy.getName) {
    var mitem = cE("menuitem")
    mitem.setAttribute("id", i);
    mitem.setAttribute("type", "radio");
    mitem.setAttribute("label", proxy.getName[i]);
    mitem.addEventListener('click', function() { changeDefaultLabel(this); })
    if (i == prefs.defaultProxy) mitem.setAttribute("checked", true);
    menupop.appendChild(mitem);
  }

  E("defaultButton").label = defaultLabel + proxy.nameOfDefaultProxy;

  // user don't use listed proxy, add by himself.
  var customItem = cE("menuitem");
  customItem.setAttribute("id", "customItem");
  customItem.setAttribute("label", E("defaultButton").getAttribute("customLabel"));
  customItem.addEventListener('click', function() { customDefaultProxy(); })
  menupop.appendChild(customItem);
}

/**
 * Click handler of "Add a new proxy" button.
 */
function customDefaultProxy()
{
  openDialog("editProxyServer.xul", "_blank", "chrome,centerscreen,modal");
  while ( menupop.firstChild ) menupop.removeChild(menupop.firstChild);
  createMenuItems();
}

/**
 * Change the "Default Proxy" button's label. for example:
 * Default Proxy: Tor --> Default Proxy: GAppProxy
 */
function changeDefaultLabel(mitem)
{
  selectedId = parseInt(mitem.id);
  E("defaultButton").label = defaultLabel + mitem.label;
}

/**
 * function for accept button, save default proxy and subscribe.
 */
function subscribeAndSetDefault()
{
  if (autoAdd) {
    prefs.defaultProxy = selectedId;
    prefs.save();
  }

  var group = E("subscriptions");
  var selected = group.selectedItem;
  if (!selected)
    return;

  result.url = selected.getAttribute("_url");
  result.title = selected.getAttribute("_title");
  result.autoDownload = true;
  result.disabled = false;

  if (autoAdd)
    aup.addSubscription(result.url, result.title, result.autoDownload, result.disabled);
}

/**
 * Popup dialog for add a custom subscription.
 */
function addOther() {
  openDialog("subscription.xul", "_blank", "chrome,centerscreen,modal", null, result);
  if ("url" in result)
  {
    if (autoAdd)
      aup.addSubscription(result.url, result.title, result.autoDownload, result.disabled);
    window.close();
  }
}

function handleKeyPress(e) {
  switch (e.keyCode) {
    case e.DOM_VK_PAGE_UP:
    case e.DOM_VK_PAGE_DOWN:
    case e.DOM_VK_END:
    case e.DOM_VK_HOME:
    case e.DOM_VK_LEFT:
    case e.DOM_VK_RIGHT:
    case e.DOM_VK_UP:
    case e.DOM_VK_DOWN:
      return false;
  }
  return true;
}

function handleCommand(event)
{
  let scrollBox = document.getElementById("subscriptionsScrollbox")
                          .boxObject
                          .QueryInterface(Ci.nsIScrollBoxObject);
  scrollBox.ensureElementIsVisible(event.target);
  scrollBox.ensureElementIsVisible(event.target.nextSibling);
}
