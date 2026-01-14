// import fetch from "node-fetch";  // ← 이 줄 삭제

exports.handler = async function(event, context) {
    const latestRound = 1206;
    const allNumbers = [];

    for (let i = 1; i <= latestRound; i++) {
        try {
            const res = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
            const data = await res.json();
            if (data.returnValue === "success") {
                allNumbers.push([data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6]);
            }
        } catch (e) {
            console.log(`회차 ${i} 가져오기 실패`, e);
        }
    }

    // 번호별 빈도 계산
    const freq = Array(46).fill(0);
    allNumbers.forEach(nums => nums.forEach(n => freq[n]++));

    const top20 = freq
        .map((count, num) => ({num, count}))
        .filter(o => o.num > 0)
        .sort((a,b) => b.count - a.count)
        .slice(0, 20)
        .map(o => o.num);

    const pool = [...top20];
    const pick = [];
    while (pick.length < 6 && pool.length) {
        const idx = Math.floor(Math.random() * pool.length);
        pick.push(pool[idx]);
        pool.splice(idx, 1);
    }

    pick.sort((a,b) => a-b);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: pick })
    };
};
