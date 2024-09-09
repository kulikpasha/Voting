
//delete
$(document).on('click', '.delete', function() {
    $('.choosen').css({opacity: 0});
    setTimeout(function() {
        $('.choosen').remove()
    }, 500)
});

//chooseFunction

setTimeout(function() {
    $(document).ready(function() {
        $(document).on('click', '.highlight', choosePoll)
})}, 500);

function choosePoll() {
    $(`#pollId${this.id}`).toggleClass('choosen')
}


//render
$(document).on('click', '.render', function() {
    const button = $(this); // кнопка, по которой кликнули
    const buttonText = button.text().trim();

    if (buttonText === 'Редактировать') {
        $('.upperPoll').css({opacity: '0'})
        $('.upperPoll').css('z-index', -1)
        $(`#upperPollId${this.id}`).css({opacity: '1'})
        $(`#upperPollId${this.id}`).css('z-index', 1)
        $('.render').text('Отмена')
        $('.highlight').text('Сохранить')
        $('.highlight').addClass('save')
        $('.save').removeClass('highlight')
        $(`#adminPanelId${this.id}`).addClass('active_panel')
        if (document.getElementById(`pollId${this.id}`).classList.contains('choosen')){
            $(`#pollId${this.id}`).toggleClass('choosen')
        }
    } else {
        $(`#adminPanelId${this.id}`).removeClass('active_panel')
        $('.upperPoll').css('z-index', 1)
        $('.upperPoll').css({opacity: '1'})
        $('.render').text('Редактировать')
        $('.save').text('Выделить')
        $('.save').addClass('highlight')
        $('.highlight').removeClass('save')
    }
})