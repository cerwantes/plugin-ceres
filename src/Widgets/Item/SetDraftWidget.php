<?php

namespace Ceres\Widgets\Item;

use Ceres\Widgets\Helper\BaseWidget;
use Ceres\Widgets\Helper\Factories\Settings\ValueListFactory;
use Ceres\Widgets\Helper\Factories\WidgetDataFactory;
use Ceres\Widgets\Helper\Factories\WidgetSettingsFactory;
use Ceres\Widgets\Helper\WidgetCategories;
use Ceres\Widgets\Helper\WidgetTypes;

class SetDraftWidget extends BaseWidget
{
    protected $template = "Ceres::Widgets.Item.SetDraftWidget";

    public function getData()
    {
        return WidgetDataFactory::make("Ceres::SetDraftWidget")
            ->withLabel("set draft mockup")
            ->withPreviewImageUrl("/images/plentymarkets-logo.svg")
            ->withType(WidgetTypes::ITEM)
            ->withCategory(WidgetCategories::ITEM)
            ->withPosition(-1)
            ->toArray();
    }

    public function getSettings()
    {
        /** @var WidgetSettingsFactory $settingsFactory */
        $settingsFactory = pluginApp(WidgetSettingsFactory::class);

        $settingsFactory->createSelect('draftVersion')
            ->withDefaultValue(1)
            ->withName('draft version')
            ->withListBoxValues(
                ValueListFactory::make()
                ->addEntry(1, 'Widget.widgetNum1')
                ->addEntry(2, 'Widget.widgetNum2')
                ->addEntry(3, 'Widget.widgetNum3')
                ->toArray()
            );

        return $settingsFactory->toArray();
    }
}
