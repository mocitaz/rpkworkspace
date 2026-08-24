<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfRenderer
{
    /**
     * @param  view-string  $view
     * @param  array<string, mixed>  $data
     */
    public function render(string $view, array $data): string
    {
        $options = new Options;
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', false);
        $options->setChroot(public_path());

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml(view($view, $data)->render());
        $dompdf->setPaper('a4');
        $dompdf->render();

        return $dompdf->output();
    }
}
