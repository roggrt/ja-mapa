$(window).scroll(function() {
  if (checkScroll) {
    if ($(this).scrollTop() > 100) {
      $('#header').removeClass('transparent');
      $('#header').find('.btn-javirtual a.btn-default').addClass('btn-primary');
    } else {
      $('#header').addClass('transparent');
      $('#header').find('.btn-javirtual a.btn-default').removeClass('btn-primary');
    }
  }
});

// Buscador
$('#formBuscar').on('click', '.search-icon', function(e) {
  //$('.inputContainer').show()
  $('.inputContainer').toggleClass('display');
  var display = $('.inputContainer').hasClass('display');
  if ( display === true ) {
    $('.inputContainer').show();
  } else if ( display === false ) {
    $('.inputContainer').hide();
  }
});

$('#header').on('submit', '#formBuscar', function(e) {
  e.preventDefault();
  var urlDestino = $('#formBuscar').data('destino');
  var textoABuscar = $('#inputBuscar').val();
  var dataEncoded = btoa('textoABuscar=' + textoABuscar);
  window.location = urlDestino + '?data=' + dataEncoded;
});
