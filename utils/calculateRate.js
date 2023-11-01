const calculateRate = (farmerLevel, fixedRate, rateChartData, fat, snf) => {

    const parsedFat = parseFloat(fat);
    const parsedSnf = parseFloat(snf);

    let rate = 0;

    if (farmerLevel === 5) {
        rate = fixedRate;
    } else if (parsedFat !== 0 && parsedSnf !== 0) {

        rateChartFarmer = rateChartData.find((item) => item.level === farmerLevel);

        const { category, stdFatRate, stdSNFRate, stdTSRate, incentive } = rateChartFarmer;

        switch (category) {
            case "KGFAT + KGSNF":
                rate =
                    (stdFatRate * parsedFat) +
                    (stdSNFRate * parsedSnf) +
                    (parsedFat + parsedSnf) * stdTSRate +
                    incentive;
                break;

            case "KG FAT ONLY":
                rate = (stdFatRate * parsedFat) + incentive;
                break;

            default:
                throw new Error("Invalid Category");
        }
    } else {
        throw new Error("Invalid input values");
    }

    return rate.toFixed(2);
}

export default calculateRate;