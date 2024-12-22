$(function () {
    // 遊戲參數
    const rem = 75; // 界面單位比例
    const WIDTH = Math.floor(document.documentElement.clientWidth * 0.45); // 福袋寬度

    const gameData = {
        freeAttempts: 5, // 免費次數
        paidAttempts: 0, // 付費次數
        totalAttempts() { return this.freeAttempts + this.paidAttempts; },
        decrementAttempts() {
            if (this.freeAttempts > 0) this.freeAttempts--;
            else if (this.paidAttempts > 0) this.paidAttempts--;
        }
    };

    let isPlaying = false; // 防止多次點擊
    let timer; // 動畫計時器

    // 界面元素
    const $hook = $("#hook");
    const $btn = $("#btn");
    const $behindList = $(".behind ul li");
    const $frontList = $(".front ul li");
    const $topBags = $(".behind img");
    const $bottomBags = $(".front img");

    // 初始化界面
    $(".behind li,.front li").css("width", WIDTH + "px");
    updateAttemptsUI();
    startConveyorAnimation();

    // 開始遊戲按鈕
    $btn.click(function () {
        if (isPlaying || gameData.totalAttempts() <= 0) return;

        isPlaying = true;
        gameData.decrementAttempts();
        updateAttemptsUI();

        const randomLeft = Math.floor(Math.random() * 490 + 130); // 隨機吊鉤位置

        // 黃金礦工鉤子動畫
        $hook.animate({ left: randomLeft / rem + "rem" }, 1000, function () {
            $hook.animate({ top: -150 / rem + "rem" }, 1000, function () {
                checkCollision(randomLeft);
                $hook.animate({ top: 0 }, 1000, function () {
                    isPlaying = false;
                });
            });
        });
    });

    // 判定是否抓到福袋
    function checkCollision(randomLeft) {
        // 檢查後方福袋
        $behindList.each(function (index) {
            const bagLeft = $(this).position().left;
            if (randomLeft - 130 <= bagLeft && bagLeft <= randomLeft - 50) {
                attachBag($topBags.eq(index));
                return false;
            }
        });

        // 檢查前方福袋
        $frontList.each(function (index) {
            const bagLeft = $(this).position().left - 200;
            if (randomLeft - 130 <= bagLeft && bagLeft <= randomLeft) {
                attachBag($bottomBags.eq(index));
                return false;
            }
        });
    }

    // 黃金礦工鉤子抓取福袋
    function attachBag($bag) {
        if ($hook.find("img").length) return; // 如果已經抓到福袋則不再抓取

        $bag.css({
            width: 100 / rem + "rem",
            height: 120 / rem + "rem"
        });
        $hook.append($bag);
        setTimeout(() => {
            alert("恭喜獲得獎品！");
            resetBag($bag);
        }, 1000);
    }

    // 重置福袋位置
    function resetBag($bag) {
        $bag.removeAttr("style").appendTo($bag.parent());
    }

    // 更新次數顯示
    function updateAttemptsUI() {
        $("#change").text(gameData.totalAttempts());
        if (gameData.totalAttempts() <= 0) {
            alert("次數用完了，請購買更多次數！");
            // 禁用按钮
            $btn.prop("disabled", true);
        } else {
            $btn.prop("disabled", false);
        }
    }

    // 傳送帶動畫
    function startConveyorAnimation() {
        function moveConveyor() {
            const leftMargin = parseFloat($(".moveing-left").css("margin-left")) - 1.5;
            $(".moveing-left").css("margin-left", leftMargin <= -WIDTH ? 0 : leftMargin);

            const rightMargin = parseFloat($(".moveing-right").css("margin-right")) - 1.5;
            $(".moveing-right").css("margin-right", rightMargin <= -WIDTH ? 0 : rightMargin);

            timer = requestAnimationFrame(moveConveyor);
        }

        moveConveyor();
    }
});
