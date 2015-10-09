$(function() {
  var allGroups = [1,2,3,4,5,6,7,8,9,10];

  function toggleGroup(group) {
    group = group + '';
    var elm = $('.word-group').filter(function(i, elm) {
      return $(elm).text() == group;
    });
    elm.toggleClass('active');
    console.log(elm.text());
  }

  function groupEnabled(group) {
    group = group + '';
    var elm = $('.word-group').filter(function(i, elm) {
      return $(elm).text() == group;
    });
    return elm.hasClass('active');
  }

  function enableGroup(group) {
    if (!groupEnabled(group)) {
      toggleGroup(group);
    }
  }

  function disableGroup(group) {
    if (groupEnabled(group)) {
      toggleGroup(group);
    }
  }
  
  $('.word-group').on('click', function() {
    var elm = $(this);

    elm.blur();

    var group = parseInt(elm.text());
    if (isNaN(group)) {
      if (elm.text() == '*') {
        allGroups.map(enableGroup);
      } else {
        allGroups.map(disableGroup);
      }
      
    } else {
      toggleGroup(group);
    }
  });
});
