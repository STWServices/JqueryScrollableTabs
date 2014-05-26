

var TriSysFormTabs = {
    tabCount: 2,
    tabTemp: "<li><a href='#{href}' title='#{label}'><img src='#{src}' alt='icon'> #{label} </a><span class='close ui-icon-close'><img src='images/close-icon.png' alt='close'></span></li>",

    AddTab: function (sImagePath, sCaption, sDataString, selectTabFunction, closeTabFunction) {
        var tabs = $("#tabs").tabs();

        var label = sCaption || "Tab " + tabCount,
         id = "tabs-" + tabCount,
         logo = sImagePath,
         li = $(tabTemp.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label).replace(/#\{src\}/g, logo)),
         tabContentHtml = sDataString || "Tab " + tabCount + " content.";

        tabs.find(".ui-tabs-nav").append(li);
        tabs.append("<div id='" + id + "'>" + tabContentHtml + "</div>");
        tabs.tabs("refresh");
        tabCount++;
    },
    OnTabSelect: function (sTabCaption, sTabTag) {
    },
    OnTabClose: function (sTabCaption, sTabTag, bCancel) {
    },
    SelectTab: function (sDataString) {
    },
    CloseTab: function (sDataString) {
        var tabs = $("#tabs").tabs();
        $('#tabs .ui-tabs-nav li').each(function (n, v) {
            if ($(this).attr("aria-selected") == "true") {
                var panelId = $(this).closest("li").remove().attr("aria-controls");
                $("#" + panelId).remove();

                var stab = $(this).find(".ui-tabs-anchor").text();
                TriSysFormTabs.AddActivity(stab, "close");
            }
        });
        tabs.tabs("refresh");
    },
    CloseAllTabs: function () {
        var tabs = $("#tabs").tabs();
        $('#tabs .ui-tabs-nav li').each(function (n, v) {

            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();

        });
        tabs.tabs("refresh");
        TriSysFormTabs.AddActivity("", "closeall");
    },
    AddActivity: function (label, type) {
        var actcont = $(".content");
        switch (type) {
            case "add":
                actcont.find(".activities").append("<li>Added tab \"" + label + "\" </li>");
                break;
            case "close":
                actcont.find(".activities").append("<li>Closed tab \"" + label + "\" </li>");

                break;
            case "closeall":
                actcont.find(".activities").append("<li>Closed all tabs </li>");
                break;
            case "select":
                actcont.find(".activities").append("<li>Selected tab \"" + label + "\" </li>");
                break;
        }

    },

    ShowArrow: function (tabWidth, visibleTab, totalTab) {
        //debugger;
        var currentleftPos = $('#tabUl').position().left;
        var tabHiddenLeft = Math.round(Math.abs(currentleftPos) / tabWidth);
        var tabonleft = tabHiddenLeft + visibleTab;
        var tabHiddenRight = totalTab - tabHiddenLeft - visibleTab;
        var curentTab = $("#tabs").tabs('option', 'active');


        if (tabHiddenLeft > 0) {
            $('#right').show();
        } else {
            $('#right').hide();
        }

        if (tabHiddenRight > 0) {
            $('#left').show();
        } else {
            $('#left').hide();
        }

        if (curentTab != 0) { $('#right').show(); }
        if (curentTab != (totalTab - 1)) { $('#left').show(); }
    }
};


$(function () {




    var tabTitle = $("#tab_title"),
      tabContent = $("#tab_content"),
      tablogo = $("#tab_logo"),
      tabTemplate = "<li><a href='#{href}' title='#{label}'><img src='#{src}' alt='icon'> #{label}  </a><span class='close ui-icon-close'><img src='images/close-icon.png' alt='close'></span></li>",
      tabTemplate_Close = "<li><a href='#{href}' title='#{label}'><img src='#{src}' alt='icon'> #{label} </a> </li>",
      tabUL = $('#tabUl'),
      left = $('#left'),
      right = $('#right'),
      visibleTab = 0,
      totalTab = 0,
      tabWidth = 0,
      maxLeft = 0,
      totalTab = 0,
      tabCounter = 2;

    var tabs = $("#tabs").tabs({
        activate: function (event, ui) {           
            //var tabNumber = ui.newTab.index();
            var tabName = $(ui.newTab).find(".ui-tabs-anchor").text();
            TriSysFormTabs.AddActivity(tabName.trim(), "select");
        }
    });
    //create tab

    tabUL.css('width', tabs.width());

    /*tab slider*/
    left.click(function () {
        var ct = tabs.tabs('option', 'active');
        tabs.tabs("option", "active", (ct + 1));
        totalTab= $('li', tabUL).length;
        if ((ct + 1) == (totalTab - 1)) { left.hide(); }

        if (tabUL.position().left > (maxLeft)) {
            left.hide();
            tabUL.animate({
                left: '-=' + tabWidth
            }, 300, function () {
                TriSysFormTabs.ShowArrow(tabWidth, visibleTab, totalTab);
            });
        }
    });

    right.click(function () {
        var ct = tabs.tabs('option', 'active');
        tabs.tabs("option", "active", (ct - 1));
        if ((ct - 1) == 0) { right.hide(); }

        if (tabUL.position().left < 0) {
            right.hide();
            tabUL.animate({
                left: '+=' + tabWidth
            }, 300, function () {
                TriSysFormTabs.ShowArrow(tabWidth, visibleTab, totalTab);
            });
        }
    });


    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Add: function () {
                addTab();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });

    // addTab form: calls addTab function on submit and closes the dialog
    var form = dialog.find("form").submit(function (event) {
        addTab();
        dialog.dialog("close");
        event.preventDefault();
    });

    //sortable tabs
    tabs.find(".ui-tabs-nav").sortable({
        axis: "x",
        stop: function () {
            tabs.tabs("refresh");
        }
    });

    // actual addTab function: adds new tab using the input from the form above
    function addTab() {

        var label;

        var chk = $('#chkCancel').is(':checked');
        if (chk) {
            label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        logo = tablogo.val(),
        li = $(tabTemplate_Close.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label).replace(/#\{src\}/g, logo)),
        tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
        }
        else {
            label = tabTitle.val() || "Tab " + tabCounter,
          id = "tabs-" + tabCounter,
          logo = tablogo.val(),
          li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label).replace(/#\{src\}/g, logo)),
          tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";

        }

        // TriSysFormTabs.AddTab(tablogo.val(), tabTitle.val(), tabContent.val(), '', '');

        tabs.find(".ui-tabs-nav").append(li);
        tabs.append("<div id='" + id + "'>" + tabContentHtml + "</div>");
        tabs.tabs("refresh");

        totalTab = $('li', tabUL).length;

        //add width in ul
        if (visibleTab == 0) { //calculate number of visible tab
            tabWidth = $("li", tabUL).outerWidth(true);
            visibleTab = Math.floor(tabs.width() / tabWidth);
        }
        // alert("visibleTab-" + visibleTab + ", tabWidth-" + tabWidth +  ", totalTab-" + totalTab);
        //add width in tab ul
        if (totalTab > visibleTab) {
            var cuiwidth = tabUL.width();
            tabUL.css('width', (cuiwidth + tabWidth) + 'px');
            var extraTabs = totalTab - visibleTab;
            maxLeft = -(extraTabs * tabWidth);
            var index = [totalTab - 1];

            // tabs.tabs('select', index);
            tabs.tabs("option", "active", index);
            // debugger;
            index++;
            var currentleftPos = tabUL.position().left;
            var tabHiddenLeft = Math.round(Math.abs(currentleftPos) / tabWidth);

            //  alert("index-" + index + ", currentleftPos-" + currentleftPos + ", tabHiddenLeft-" + tabHiddenLeft);
            if (tabHiddenLeft >= index) {
                var rigtAnimate = (tabHiddenLeft - index + 1) * tabWidth;
                tabUL.animate({
                    left: '+=' + rigtAnimate
                }, 300, function () {
                    TriSysFormTabs.ShowArrow(tabWidth, visibleTab, totalTab);
                });
            } else {
                var tabonleft = tabHiddenLeft + visibleTab;
                var tabHiddenRight = totalTab - tabHiddenLeft - visibleTab;

                if (tabHiddenRight > 0 && index > tabonleft) {
                    var rightIndex = (index - tabonleft);
                    var leftAnimate = rightIndex * tabWidth;
                    tabUL.animate({
                        left: '-=' + leftAnimate
                    }, 300, function () {
                        TriSysFormTabs.ShowArrow(tabWidth, visibleTab, totalTab);
                    });

                }
            }


        } else {
            //  tabs.tabs('select', (totalTab - 1));
            tabs.tabs("option", "active", (totalTab - 1));
        }

        tabCounter++;

        TriSysFormTabs.AddActivity(label, "add");


    }

    // addTab button: just opens the dialog
    $("#add_tab")
      .button()
      .click(function () {
          dialog.dialog("open");
      });

    $("#close_select")
     .button()
     .click(function () {
         TriSysFormTabs.CloseTab('');
     });

    $("#close_alltab")
    .button()
    .click(function () {
        TriSysFormTabs.CloseAllTabs();
    });

    // close icon: removing the tab on click
    tabs.delegate("span.close", "click", function () {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        tabs.tabs("refresh");
       
        var stab = $(this).closest("li").find(".ui-tabs-anchor").text();
        TriSysFormTabs.AddActivity(stab.trim(), "close");
    });

    tabs.bind("keyup", function (event) {
        if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
            var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
            $("#" + panelId).remove();
            tabs.tabs("refresh");
        }
    });

   // $(window).bind('resize', function() {
        //TriSysFormTabs.ShowArrow(tabWidth, visibleTab, totalTab);
       // window.location = "/";

   // });

});