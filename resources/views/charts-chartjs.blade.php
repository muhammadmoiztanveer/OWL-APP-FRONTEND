@extends('layouts.master')
@section('title')
    @lang('translation.Chartjs')
@endsection

@section('content')
    @component('common-components.breadcrumb')
        @slot('pagetitle')
            Charts
        @endslot
        @slot('title')
            Chartjs
        @endslot
    @endcomponent

    <div class="row">
        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">

                    <h4 class="card-title mb-4">Line Chart</h4>

                    <canvas id="lineChart" class="chartjs-chart"
                        data-colors='["--bs-primary-rgb, 0.2", "--bs-primary", "--bs-light-rgb, 0.2", "--bs-light"]'
                        height="300"></canvas>

                </div>
            </div>
        </div> <!-- end col -->

        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">

                    <h4 class="card-title mb-4">Bar Chart</h4>

                    <canvas id="bar" data-colors='["--bs-success-rgb, 0.8", "--bs-success"]' height="300"></canvas>

                </div>
            </div>
        </div> <!-- end col -->
    </div> <!-- end row -->


    <div class="row">
        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title mb-4">Pie Chart</h4>
                    <div style="height: 260px !important;">
                        <canvas id="pieChart" class="mx-auto" data-colors='["#2ab57d", "#ebeff2"]'></canvas>
                    </div>
                </div>
            </div>
        </div> <!-- end col -->

        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title mb-4">Donut Chart</h4>
                    <div style="height: 260px !important;">
                        <canvas id="doughnut" data-colors='["--bs-primary", "#ebeff2"]' class="mx-auto"></canvas>
                    </div>
                </div>
            </div>
        </div> <!-- end col -->
    </div> <!-- end row -->

    <div class="row">
        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title mb-4">Polar Chart</h4>
                    <div style="height: 300px !important;">
                        <canvas id="polarArea" data-colors='["#50a5f1", "#2ab57d", "#f1b44c", "#5b73e8"]'
                            class="mx-auto"></canvas>
                    </div>
                </div>
            </div>
        </div> <!-- end col -->

        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title mb-4">Radar Chart</h4>
                    <div style="height: 300px !important;">
                        <canvas id="radar" class="mx-auto"
                            data-colors='["rgba(241, 181, 76, 0.2)", "#f1b44c", "rgba(91, 115, 323, 0.2)", "#5b73e8"]'></canvas>
                    </div>
                </div>
            </div>
        </div> <!-- end col -->
    </div>
@endsection
@section('script')
    <script src="{{ URL::asset('/assets/libs/chart-js/chart-js.min.js') }}"></script>
    <script src="{{ URL::asset('/assets/js/pages/chartjs.init.js') }}"></script>
@endsection
