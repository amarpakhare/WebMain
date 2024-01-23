(function ($, window, document) {
  "use strict";

  $(window).on("elementor/frontend/init", function () {
    elementorFrontend.hooks.addAction(
      "frontend/element_ready/section",
      function ($scope) {
        // Check if the model-cid attribute is defined
        if ($scope.data("model-cid")) {
          if (elementorFrontend.isEditMode()) {
            // Check if the attributes property is defined
            var settings =
              elementorFrontend.config.elements.data[$scope.data("model-cid")]
                ?.attributes;

            if (settings && settings.tp_section_images?.length) {
              // Check if $scope.data('id') is defined
              var $existingImages = $scope.find(
                ".tp-section-image-" + $scope.data("id")
              );
              if ($existingImages.length) {
                $existingImages.remove();
              }

              var $items = "";

              $.each(settings.tp_section_images.models, function (index, item) {
                // Check if item and item.attributes are defined
                if (item && item.attributes) {
                  $items +=
                    '<div class="shapeanimation tp-section-image tp-section-image-' +
                    $scope.data("id") +
                    " elementor-repeater-item-" +
                    item.attributes._id +
                    '"></div>';
                }
              });

              if ($items.length) {
                $scope.prepend($items);
              }
            }
          } else {
            // Check if $scope.data('tp-section-image') is defined
            if ($scope.data("tp-section-image")) {
              // Check if $scope.data('id') is defined
              var $items = $(".tp-section-image-" + $scope.data("id"));

              if ($items.length) {
                $scope.prepend($items);
              }
            }
          }
        }
      }
    );
  });
})(jQuery, window, document);
