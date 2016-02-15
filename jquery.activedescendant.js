/**
 * @file jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
 * @author Ian McBurnie <ianmcburnie@hotmail.com>
 */

(function($, window, document, undefined) {

    var pluginName = 'jquery-active-descendant';

    /**
    * jQuery definition to anchor JsDoc comments.
    *
    * @see http://jquery.com/
    * @name $
    * @class jQuery Library
    */

    /**
    * jQuery 'fn' definition to anchor JsDoc comments.
    *
    *
    * @see http://jquery.com/
    * @name fn
    * @class jQuery Plugin Scope
    * @memberof jQuery
    */

    /**
    * jQuery collection plugin that implements aria-activedescendant keyboard navigation on given widgets
    *
    * @class activeDescendant
    * @version 0.7.0
    * @fires activeDescendantChange - when activedescendant changes
    * @listens updateActiveDescendantCollection - to receive new descendant items
    * @param {string} focusItemSelector - targets the focusable descendant item (in relation to widget)
    * @param {string} descendantItemsSelector - targets the descendant items (in relation to widget) that can be active
    * @return {jQuery} chainable jQuery class
    * @requires @ebay/jquery-next-id
    * @requires @ebay/jquery-common-keydown
    * @memberof jQuery.fn
    */

    /**
    * activeDescendantChange event
    *
    * @event activeDescendantChange
    * @type {object}
    * @property {object} event - event object
    * @property {object} newActiveDescendant - new active descendant element
    * @memberof jQuery.fn.activeDescendant
    */

    /**
    * updateActiveDescendantCollection event
    *
    * @event updateActiveDescendantCollection
    * @type {object}
    * @property {object} newActiveDescendantCollection - new active descendant collection
    * @memberof jQuery.fn.activeDescendant
    */

    $.fn.activeDescendant = function activeDescendant(focusItem, descendantItems, options) {

        options = options || {};

        return this.each(function onEach() {

            var $widget = $(this);
            var $focusItem = $widget.find(focusItem);
            var $descendantItems;

            $widget.nextId();
            $focusItem.commonKeyDown();

            $widget.on('updateActiveDescendantCollection', function(e, collection) {
                $descendantItems = $widget.find(collection);
                $descendantItems.nextId();
                $descendantItems.each(function(idx, itm) {
                    // store index position in element data
                    // remember, descendants are not always siblings in DOM!
                    $(itm).data(pluginName, {'idx': idx});
                });
            });

            $focusItem.on('blur', function() {
                $('#' + $focusItem.attr('aria-activedescendant')).removeClass('activedescendant');
                $focusItem.removeAttr('aria-activedescendant');
            });

            // todo: normalise following two functions

            $focusItem.on('downArrowKeyDown', function onDownArrowKeyDown(e) {
                if ($descendantItems) {
                    var $activedescendant = $('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activedescendant.size() === 0) {
                        $newActiveDescendant = $descendantItems.first();
                    } else {
                        var itemIdx = $activedescendant.data(pluginName).idx;
                        var $nextEl = $descendantItems.eq(itemIdx + 1);
                        var hasNextEl = $nextEl.length === 1;
                        var $firstEl = $descendantItems.eq(0);

                        $newActiveDescendant = (hasNextEl) ? $nextEl : $firstEl;
                    }

                    $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));
                    $activedescendant.removeClass('activedescendant');
                    $newActiveDescendant.addClass('activedescendant');
                    $widget.trigger('activeDescendantChange', $newActiveDescendant);
                }
            });

            $focusItem.on('upArrowKeyDown', function onUpArrowKeyDown(e) {
                if ($descendantItems) {
                    var $activedescendant = $('#' + $focusItem.attr('aria-activedescendant'));
                    var $newActiveDescendant;

                    if ($activedescendant.size() === 0) {
                        $newActiveDescendant = $descendantItems.last();
                    } else {
                        var itemIdx = $activedescendant.data(pluginName).idx;
                        var $prevEl = $descendantItems.eq(itemIdx - 1);
                        var hasPrevEl = $prevEl.length === 1;
                        var $lastEl = $descendantItems.eq($descendantItems.length - 1);

                        $newActiveDescendant = (hasPrevEl) ? $prevEl : $lastEl;
                    }

                    $focusItem.attr('aria-activedescendant', $newActiveDescendant.prop('id'));
                    $activedescendant.removeClass('activedescendant');
                    $newActiveDescendant.addClass('activedescendant');
                    $widget.trigger('activeDescendantChange', $newActiveDescendant);
                }
            });

            if (descendantItems) {
                $widget.trigger('updateActiveDescendantCollection', [descendantItems]);
            }
        });
    };

}(jQuery, window, document));
