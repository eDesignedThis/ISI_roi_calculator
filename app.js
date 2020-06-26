console.log("app is running");

//=======================================Sliders for ROI Form=================================================

//Average Gross Margin Slider
var avgGrossMarginSlider = document.getElementById("avg_gross_margin");
var avgGrossMarginSliderOutput = document.getElementById(
  "avg_gross_margin_output"
);
avgGrossMarginSliderOutput.textContent = avgGrossMarginSlider.value;

avgGrossMarginSlider.oninput = function () {
  avgGrossMarginSliderOutput.innerHTML = this.value;
};

//Sales Increase Estimate Slider

var salesIncreaseEstSlider = document.getElementById("sales_increase_est");
var salesIncreaseEstSliderOutput = document.getElementById(
  "sales_increase_est_output"
);

salesIncreaseEstSliderOutput.textContent = salesIncreaseEstSlider.value;

salesIncreaseEstSlider.oninput = function () {
  salesIncreaseEstSliderOutput.innerHTML = this.value;
};

//Sales Payout Slider
var salesPayoutSlider = document.getElementById("sales_payout");
var salesPayoutSliderOutput = document.getElementById("sales_payout_output");

salesPayoutSliderOutput.textContent = salesPayoutSlider.value;

salesPayoutSlider.oninput = function () {
  salesPayoutSliderOutput.innerHTML = this.value;
};

//Current ROI
var currentRoiSlider = document.getElementById("current_roi");
var currentRoiSliderOutput = document.getElementById("current_roi_output");

currentRoiSliderOutput.textContent = currentRoiSlider.value;

currentRoiSlider.oninput = function () {
  currentRoiSliderOutput.innerHTML = this.value;
};

// Calculate ROI
var avg_cust_sales_vol = document.getElementById("avg_cust_sales_vol");
var num_target_cust = document.getElementById("num_target_cust");
var avg_gross_margin = document.getElementById("avg_gross_margin");
var sales_increase_est = document.getElementById("sales_increase_est");
var sales_payout = document.getElementById("sales_payout");

//========================================Currency input field==================================================
// avg_cust_sales_vol.addEventListener(
//   "keyup",
//   function (event) {
//     // skip for arrow keys
//     if (event.which >= 37 && event.which <= 40) return;

//     // format number
//     $(this).val(function (index, value) {
//       return (
//         "$" + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//       );
//     });

//     CalculateROI();
//   },
//   false
// );

//========================================Number input field==================================================
// num_target_cust.addEventListener(
//   "keyup",
//   function (event) {
//     // skip for arrow keys
//     if (event.which >= 37 && event.which <= 40) return;

//     // format number
//     $(this).val(function (index, value) {
//       return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     });

//     CalculateROI();
//   },
//   false
// );

//========================================Percentage input fields=================================================
function handlePercentages(event) {
  //skip for arrow keys
  if (event.which >= 37 && event.which <= 40) return;

  //skip for backspace.
  if (event.which == 8) return;

  // format number
  $(this).val(function (index, value) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
  });

  CalculateROI();
}

avg_gross_margin.addEventListener("keyup focusout", handlePercentages, false);
sales_increase_est.addEventListener("keyup focusout", handlePercentages, false);
sales_payout.addEventListener("keyup focusout", handlePercentages, false);

//========================================ROI Stuff=================================================

//Calculate after user moves on to another field
$(".roi_input").focusout(function (event) {
  CalculateROI();
});

//Calculate when the page loads
//CalculateROI();

function CalculateROI() {
  function handleNaN(value) {
    if (value == "") return "0";
    return value;
  }

  var avg_cust_sales_vol = parseInt(
    handleNaN(
      $("#avg_cust_sales_vol")
        .val()
        .replace(/[^0-9.-]+/g, "")
    )
  );
  var num_target_cust = parseInt(
    handleNaN(
      $("#num_target_cust")
        .val()
        .replace(/[^0-9.-]+/g, "")
    )
  );

  var avg_gross_margin =
    parseFloat(
      handleNaN(
        $("#avg_gross_margin")
          .val()
          .replace(/[^0-9.-]+/g, "")
      )
    ) / 100; //percent
  var sales_increase_est =
    parseFloat(
      handleNaN(
        $("#sales_increase_est")
          .val()
          .replace(/[^0-9.-]+/g, "")
      )
    ) / 100; //percent
  var sales_payout =
    parseFloat(
      handleNaN(
        $("#sales_payout")
          .val()
          .replace(/[^0-9.-]+/g, "")
      )
    ) / 100; //percent

  var total_sales_target_cust = parseInt(num_target_cust * avg_cust_sales_vol);
  $("#total_sales_target_cust").val(
    "$" + total_sales_target_cust.toLocaleString()
  ); //Total Sales of Target Customers

  var total_prog_cost = parseInt(
    sales_payout * (total_sales_target_cust * (1 + sales_increase_est))
  );
  $("#total_prog_cost").val("$" + total_prog_cost.toLocaleString()); //Total Program Cost
  $("#prog_cost").val("$" + total_prog_cost.toLocaleString()); //Program Cost...same as Total Program Cost

  var avg_cust_equity = parseInt(total_prog_cost / num_target_cust);
  $("#avg_cust_equity").val("$" + avg_cust_equity.toLocaleString()); //Average Customer Equity

  var sales_increase = parseInt(total_sales_target_cust * sales_increase_est);
  $("#sales_increase").val("$" + sales_increase.toLocaleString()); //Sales Increase

  var margin_increase = parseInt(sales_increase * avg_gross_margin);
  $("#margin_increase").val("$" + margin_increase.toLocaleString()); //Margin Increase

  var roi =
    total_prog_cost == 0
      ? 0
      : Math.round(
          parseFloat(
            ((margin_increase - total_prog_cost) / total_prog_cost) * 100
          )
        );
  $("#roi").val(roi + "%"); //ROI

  var avg_monthly_benifit = parseInt((margin_increase - total_prog_cost) / 12);
  $("#avg_monthly_benifit").val("$" + avg_monthly_benifit.toLocaleString()); //ROI

  console.log(avg_monthly_benifit);

  //=======================================Update Charts and UI=============================
  //Show Text Results

  var resultAvgMonthlyBenefit = "$" + avg_monthly_benifit.toLocaleString();
  var resultRoi = roi.toLocaleString() + "% ";

  var currentRoi = document.getElementById("current_roi").value;

  $("#form-wrapper").html(
    '<div id="roi-text-results-wrapper" class="col-xl-6 mx-auto text-center"><div class="display-4 text-success text-center border-bottom">' +
      resultRoi +
      '</div><div id="roi-results" class="col-12 mx-auto d-block"><p class="lead my-3">Hey! You are missing out on an average benefit of <span id="#avg_monthly_benifit" class="text-success font-weight-bold">' +
      resultAvgMonthlyBenefit +
      '</span> for every month you don\'t have an incentive program.</p></div><div class="alert alert-info mb-5"><p class="mb-0">The expected<span class="font-weight-bold ml-1" id="roi">' +
      resultRoi +
      '</span><span class="font-weight-bold mr-1">ROI</span><span>from an incentive program would outperform the </span><span class="text-danger mr-1">' +
      currentRoi +
      '% ROI</span><span>of your current marketing dollars by </span><span class="font-weight-bold">2,200 percentage points!</span></p></div><div id="actions" class="col-12 justify-content-center mx-auto d-block"><div class="row"><div class="col-xl-6"><div class="form-group"><button id="download_pdf" class="btn btn-primary btn-block" type="button">Download PDF</div></div><div class="col-6"><div class="form-group"><button id="reCalc" class="btn btn-outline-primary btn-block" type="button">Recalculate ROI</div></div></div></div></div>'
  );

  // Show Lead Form
  $("#download_pdf").click(function () {
    $(
      "#form-wrapper"
    ).html(`<div id="roi-text-results-wrapper" class="col-xl-6 mx-auto text-center">
    <p>Fill out the information below to receive a PDF of your results and get a free in-depth analysis.</p>
    <form class="text-left">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="first_name" class="form-control d-block">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="last_name" class="form-control d-block">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" id="company" class="form-control d-block">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Work Email</label>
                    <input type="text" id="work_email" class="form-control d-block">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Work Phone</label>
                    <input type="text" id="work_phone" class="form-control d-block">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Industry</label>
                    <select id="industry" class="custom-select form-control">
                        <option selected>Choose your Industry</option>
                        <option value="1">Agriculture</option>
                        <option value="2">Automotive</option>
                        <option value="3">Banking</option>
                    </select>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Primary Incentive Program Goal</label>
                    <select id="industry" class="custom-select form-control">
                        <option selected>Choose your goal</option>
                        <option value="1">Increase Sales Revenue</option>
                        <option value="2">Exceed Current Marketing $ ROI</option>
                        <option value="3">Increase Brand Awareness</option>
                        <option value="4">Increase Market Share</option>
                    </select>
                </div>
            </div>
            <div class="col-xl-8 mx-auto">
                <button class="btn btn-primary btn-block" type="button">Get An In-Depth Analysis!</button>
            </div>
        </div>
    </form>
    </div>
    `);
  });
}

// Calculate ROI Button

$("#calc_button").click(function () {
  CalculateROI();

  $("#calc_button").css("display", "none");
  $("#calc_button").attr("disabled", "disabled");

  $("#reCalc").click(function () {
    $("#calc_button").attr("disabled", "");
    location.reload(true);
  });
});

// Generate DevExtreme Chart
var roiKPIs = [
  { kpi: "Revenue Increase", count: 10 },
  { kpi: "Gross Margin", count: 12 },
  { kpi: "Annual Program Cost", count: 15 },
  { kpi: "ROI Dollars", count: 20 },
];

$(function () {
  $("#chart").dxChart({
    dataSource: roiKPIs,
    series: {
      // See details in the "Bind Series to Data" topic
      argumentField: "kpi",
      valueField: "count",
      type: "bar",
      color: "#ffaa66",
    },
  });
});
