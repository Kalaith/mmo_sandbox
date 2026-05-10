<?php

declare(strict_types=1);

$roots = [
    __DIR__ . '/../public',
    __DIR__ . '/../src',
    __DIR__,
];

$errors = 0;
foreach ($roots as $root) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root));
    foreach ($iterator as $file) {
        if (!$file instanceof SplFileInfo || $file->isDir() || $file->getExtension() !== 'php') {
            continue;
        }

        $command = 'php -l ' . escapeshellarg($file->getPathname());
        exec($command, $output, $exitCode);
        if ($exitCode !== 0) {
            fwrite(STDERR, implode(PHP_EOL, $output) . PHP_EOL);
            $errors++;
        }
        $output = [];
    }
}

if ($errors > 0) {
    fwrite(STDERR, $errors . ' PHP file(s) failed syntax checks.' . PHP_EOL);
    exit(1);
}

echo 'PHP syntax checks passed.' . PHP_EOL;
