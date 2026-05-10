<?php

declare(strict_types=1);

namespace App\Core;

use DomainException;
use RuntimeException;
use Throwable;

final class Router
{
    private array $routes = [];
    private string $basePath = '';

    public function setBasePath(string $basePath): void
    {
        $this->basePath = rtrim($basePath, '/');
    }

    public function get(string $path, array $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, array $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    private function addRoute(string $method, string $path, array $handler, array $middleware): void
    {
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $this->routes[] = [
            'method' => $method,
            'pattern' => '#^' . $pattern . '$#',
            'handler' => $handler,
            'middleware' => $middleware,
        ];
    }

    public function handle(): void
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
        if ($this->basePath !== '' && strpos($path, $this->basePath) === 0) {
            $path = substr($path, strlen($this->basePath));
        }

        $path = $path === '' ? '/' : $path;
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method || !preg_match($route['pattern'], $path, $matches)) {
                continue;
            }

            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            $request = new Request($params);
            $response = new Response();

            try {
                foreach ($route['middleware'] as $middlewareClass) {
                    $middleware = new $middlewareClass();
                    $result = $middleware($request, $response);
                    if ($result instanceof Request) {
                        $request = $result;
                        continue;
                    }

                    if ($result instanceof Response) {
                        return;
                    }
                }

                $factory = new ServiceFactory();
                $controller = $factory->create($route['handler'][0]);
                $methodName = $route['handler'][1];
                $controller->$methodName($request, $response);
                return;
            } catch (DomainException $exception) {
                $response->error($exception->getMessage(), 422);
                return;
            } catch (RuntimeException $exception) {
                $response->error($exception->getMessage(), 400);
                return;
            } catch (Throwable) {
                $response->error('Unexpected server error', 500);
                return;
            }
        }

        (new Response())->error('Route not found', 404);
    }
}
