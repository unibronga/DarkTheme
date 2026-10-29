<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

/**
 * Контроллер пользователей.
 */
final class UserController extends Controller implements \JsonSerializable
{
    private const PER_PAGE = 20;
    protected static int $instances = 0;

    public function __construct(private readonly string $locale = 'uk')
    {
        self::$instances++;
    }

    public function index(Request $request): array
    {
        // Фильтрация и пагинация
        $page = (int) $request->query('page', 1);
        $users = User::where('active', true)
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE, ['*'], 'page', $page);

        return array_map(fn (User $u) => ['id' => $u->id, 'name' => "{$u->first_name} {$u->last_name}"], $users->items());
    }

    public function jsonSerialize(): mixed
    {
        return ['locale' => $this->locale, 'count' => static::$instances, 'debug' => null ?? false];
    }
}

$title = 'Пользователи';
$items = ['Анна', 'Борис', 'Вера'];
?>
<!DOCTYPE html>
<html lang="uk">
<body>
    <h1><?= htmlspecialchars($title) ?></h1>
    <?php if (count($items) > 0): ?>
        <ul>
            <?php foreach ($items as $i => $name): ?>
                <li class="item item-<?= $i ?>"><?= $name ?></li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>Нет данных</p>
    <?php endif; ?>
</body>
</html>
