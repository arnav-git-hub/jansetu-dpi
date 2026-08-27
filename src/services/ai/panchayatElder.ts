import { DemandHotspot } from '../../types';

export function getPanchayatElderStory(hotspot: DemandHotspot): string {
  const name = hotspot.villageOrWard;
  const cost = hotspot.estimatedCostLakhs;
  const pop = hotspot.totalAffectedPopulation;

  return `राम राम भाइयों और बहनों! हमारे ${name} के लिए जनसेतु व्यवस्था ने फैसला सुनाया है। 
आपकी ${hotspot.reportCount} आवाजें सुनी गई हैं। 

इस योजना ("${hotspot.title}") के तहत सरकार लगभग ₹${cost} लाख रुपये का बजट मंजूर करने जा रही है। 
इससे हमारे गांव के ${pop.toLocaleString()} लोगों को सीधे राहत मिलेगी। 

पारदर्शिता का हिसाब ऐसा है:
- समस्या की गंभीरता: ${hotspot.avgSeverityIndex}/10 अंक
- पिछड़े क्षेत्र को प्राथमिकता: ${hotspot.equityWeightScore}/10 अंक
- हर रुपये का सही असर: ${hotspot.costEfficiencyRatio}/10 अंक

ठेकेदार का सारा काम सीधे उपग्रह (satellite) और मोबाइल फोटो से जांचा जाएगा। कोई बिचौलिया पैसा नहीं रोक सकेगा। 
"आपकी आवाज़, देश की प्रायोरिटी!"`;
}
