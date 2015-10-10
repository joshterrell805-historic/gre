$(function() {
  var allGroups = [1,2,3,4,5,6,7,8,9,10];
  var words = null;
  var list = null;
  var curWord = null;
  main();

  function main() {
    $('.word-group').on('click', onClickWordGroup);
    $('#word-lists').on('change', onChangeList);
    $('#next-word').on('click', onNext);
    $('#prev-word').on('click', onPrev);
    $('#definition').on('click', onClickDefinition);
    initWordListSelector();
    setList(0);
  }

  function onClickDefinition() {
    displayWord(false);
  }

  function onChangeList() {
    var elm = $(this);
    setList(elm.val());
  }

  function onNext() {
    var elm = $(this);

    elm.blur();

    if (++curWord == words.length) {
      curWord = 0;
    }

    displayWord(true);
    updateProgressMeter();
  }

  function onPrev() {
    var elm = $(this);

    elm.blur();

    if (--curWord == -1) {
      curWord = words.length - 1;
    }

    displayWord(true);
  }

  function setList(i) {
    list = i;
    disableAllGroups();
    enableGroup(1);
    startQuiz();
  }

  /* http://stackoverflow.com/a/2450976/1433127 */
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function startQuiz() {
    var groups = enabledGroups();
    words = groups.reduce(function(words, group, i) {
      words = words.concat(wordLists[list][group-1]);
      return words;
    }, []);
    words = shuffle(words);
    curWord = 0;
    updateProgressMeter();
    displayWord(true);
  }

  function displayWord(definitionHidden) {
    
    if (words.length) {
      var word = words[curWord].word;
      var definition = definitionHidden ? '(click for definition)' :
          words[curWord].definition;
    } else { 
      var word = '';
      var definition = '';
    }

    $('#word').text(word);
    $('#definition').text(definition);
    
  }

  function updateProgressMeter() {
    $('#progress-meter').text((curWord+1) + '/' + words.length);
  }

  function onClickWordGroup() {
    var elm = $(this);

    elm.blur();

    var group = parseInt(elm.text());
    if (isNaN(group)) {
      if (elm.text() == '*') {
        enableAllGroups();
      } else {
        disableAllGroups();
      }
      
    } else {
      toggleGroup(group);
    }
  }

  function enableAllGroups() {
    allGroups.map(enableGroup);
  }

  function disableAllGroups() {
    allGroups.map(disableGroup);
  }

  function toggleGroup(group) {
    group = group + '';
    var elm = $('.word-group').filter(function(i, elm) {
      return $(elm).text() == group;
    });
    elm.toggleClass('active');
    startQuiz();
  }

  function enabledGroups() {
    return allGroups.filter(groupEnabled);
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

  function initWordListSelector() {
    for (var i = 0; i < wordLists.length; ++i) {
      $('#word-lists').append(
          $('<option value="'+i+'">List '+(i+1)+'</option>'));
    }
  }
});
