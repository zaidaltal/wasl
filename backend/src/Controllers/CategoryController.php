<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Models\Category;

class CategoryController
{
    public function getAll(): void
    {
        $categories = (new Category())->findAll();
        App::success(App::paginate($categories, count($categories)));
    }
}
