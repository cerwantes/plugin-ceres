<?php

namespace Ceres\Widgets\Item;

use Ceres\Widgets\Helper\BaseWidget;
use Ceres\Widgets\Helper\Factories\WidgetSettingsFactory;
use Ceres\Widgets\Helper\WidgetCategories;
use Ceres\Widgets\Helper\Factories\WidgetDataFactory;
use Ceres\Widgets\Helper\WidgetTypes;

class SetDraftWidget extends BaseWidget
{
    protected $template = "Ceres::Widgets.Item.SetDraftWidget";

    public function getData()
    {
        return WidgetDataFactory::make("Ceres::SetDraftWidget")
            ->withLabel("Widget.setDraftLabel")
            ->withPreviewImageUrl("/images/widgets/plentymarkets-logo.svg")
            ->withType(WidgetTypes::ITEM)
            ->withCategory(WidgetCategories::ITEM)
            ->withPosition(-1)
            ->toArray();
    }

    public function getSettings()
    {
        /** @var WidgetSettingsFactory $settingsFactory */
        $settingsFactory = pluginApp(WidgetSettingsFactory::class);

        // $settingsFactory->createCustomClass();
        // $settingsFactory->createAppearance();
        // $settingsFactory->createButtonSize();
        // $settingsFactory->createSpacing();

        return $settingsFactory->toArray();
    }
}
