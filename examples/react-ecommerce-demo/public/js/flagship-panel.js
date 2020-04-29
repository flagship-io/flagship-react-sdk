(function() {
  var $ = jQuery;
  if (!jQuery) {
    console.log("Missing jQuery !");
    return;
  }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  $(document).ready(function() {
    const sideMenu = `
    <div id="fs-sidemenu">
      <div class="inner">
        <button id="fs-sidemenu-open">FlagShip</button>
        <form class="fs-sidemenu-form">
          <div class="form-input">
            <label for="fs-visitor-id">Visitor ID</label>
            <input name="fsvisitor_id" id="fs-visitor-id" type="text" placeholder="Visitor ID"/>
          </div>
          <div class="form-input">
            <label for="fs-visitor-id">Environment ID</label>
            <input name="fsvisitor_id" id="fs-env-id" type="text" placeholder="Environment ID"/>
          </div>
  
            <div class="fs-context">
            </div>
            <button type="button" id="fs-add-context">Add context</button>
  
            <button type="submit">Save</button>
        </form>
        <div style="padding: 10px">
        <h4 style="color:#fff">Flagship variables:</h4>
        <pre id="flagship-variables" style="color:#fff"></pre>
        </div>
      </div>
    </div>
    `;

    $(document.body).append(sideMenu);

    const fillContext = (key, value) => `
    <div class="fs-context-var">
      <div>
          <label>Key</label>
          <input class="key" type="text" placeholder="Key" value="${key}"/>
          <button type="button" class="delete-context">X</button>
      </div>
      <div>
          <label>Type</label>
          <select class="type" value="${typeof value}">
            <option value="string" ${typeof value === "string" &&
              "selected"}>String</option>
            <option value="boolean" ${typeof value === "boolean" &&
              "selected"}>Boolean</option>
            <option value="number" ${typeof value === "number" &&
              "selected"}>Number</option>
          </select>
      </div>
      <div>
          <label>Value</label>
          <input class="value" type="text" placeholder="Value" value="${value}"/>
      </div>
    </div>`;

    const cookie = getCookie("fscookie");
    if (cookie) {
      const fs = JSON.parse(atob(cookie));
      $("#fs-visitor-id").val(fs.visitor_id);
      $("#fs-env-id").val(fs.environment_id);

      Object.keys(fs.context).forEach((k) => {
        $(".fs-context").append(fillContext(k, fs.context[k]));
      });
      if (fs.visitor_id && fs.environment_id) {
        $.ajax({
          type: "POST",
          url:
            "https://decision-api.flagship.io/v1/" +
            fs.environment_id +
            "/campaigns",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            visitor_id: fs.visitor_id,
            trigger_hit: false,
            context: fs.context,
          }),
          success: function(data) {
            const keys = {};
            if (data.campaigns) {
              data.campaigns.forEach((c) => {
                Object.keys(c.variation.modifications.value).forEach((k) => {
                  keys[k] = c.variation.modifications.value[k];
                });
              });
            }
            $("#flagship-variables").html(JSON.stringify(keys, null, 4));
          },
          dataType: "json",
        });
      }
    }

    $("#fs-sidemenu-open").on("click", function() {
      $("#fs-sidemenu").toggleClass("opened");
    });

    $(".fs-sidemenu-form").on("click", ".delete-context", function() {
      const parent = $(this).closest(".fs-context-var");
      console.log(parent);
      parent.remove();
    });

    $(".fs-sidemenu-form").on("submit", function(e) {
      e.preventDefault();
      const visitor_id = $("#fs-visitor-id").val();
      const environment_id = $("#fs-env-id").val();

      const context = {};
      $(".fs-context-var").each(function() {
        const key = $(this)
          .find(".key")
          .val();
        const value = $(this)
          .find(".value")
          .val();
        const type = $(this)
          .find(".type")
          .val();

        console.log({ key, value, type });

        switch (type) {
          case "string":
            context[key] = value;
            break;
          case "number":
            context[key] = Number(value);
            break;
          case "boolean":
            context[key] = value === "true";
            break;
        }
      });

      const cookie = {
        visitor_id,
        environment_id,
        context,
      };

      document.cookie = `fscookie=${btoa(
        JSON.stringify(cookie)
      )}; expires=Fri, 19 Jun 2025 20:47:11 UTC; path=/`;

      if (
        window.confirm("Parameters saved ! Do you want to reload the page ?")
      ) {
        document.location.reload();
      }
    });

    $("#fs-add-context").on("click", function() {
      $(".fs-context").append(fillContext("", ""));
    });
  });
})();
