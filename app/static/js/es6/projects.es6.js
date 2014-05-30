/* global ajax */
/* jshint unused: false */

(function(){
  'use strict';

  $(document).ready(init);

  function init() {
    $('.btn-del').click(deletePhoto);

  }

  function deletePhoto() {
    var index = $(this).closest('.thumbnail-container').attr('data-index');
    var pId= $('#project-photos').attr('data-id');
    ajax(`/portfolios/${pId}/photos/${index}`, 'delete', null, html=>{
      console.log(html);
      $(this).closest('.thumbnail-container').remove();
    });

  }

})();
