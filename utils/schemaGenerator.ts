import { FamilyMember } from '../types';

export const BASE_URL = 'https://shijra.app';

// 1. Organization Schema (Global)
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shijra",
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.png`,
  "sameAs": [
    "https://twitter.com/shijraapp",
    "https://instagram.com/shijraapp",
    "https://linkedin.com/company/shijra"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "Customer Support",
    "areaServed": ["US", "PK", "IN", "AE"],
    "availableLanguage": ["English", "Urdu", "Arabic"]
  }
});

// 2. Person Schema (For Individual Profile Pages)
export const generatePersonSchema = (member: FamilyMember, mainTreeName: string) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "image": member.img,
    "identifier": member.id,
    "memberOf": {
      "@type": "Organization", // Conceptualizing the Family as an Org or Group
      "name": `${mainTreeName} Family`
    }
  };

  // Add relations if children exist
  if (member.children && member.children.length > 0) {
    schema.children = member.children.map(child => ({
      "@type": "Person",
      "name": child.name,
      "image": child.img
    }));
  }

  return schema;
};

// 3. CollectionPage Schema (For the Family Tree View containing multiple people)
export const generateCollectionSchema = (treeName: string, members: FamilyMember[]) => {
  const flattenMembers = (node: FamilyMember): any[] => {
    let list = [{
      "@type": "Person",
      "name": node.name,
      "url": `${BASE_URL}/member/${node.id}`
    }];
    if (node.children) {
      node.children.forEach(child => {
        list = list.concat(flattenMembers(child));
      });
    }
    return list;
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${treeName} - Family Tree Registry`,
    "description": `A digital genealogy collection of the ${treeName} lineage.`,
    "url": `${BASE_URL}/tree/${treeName.replace(/\s+/g, '-').toLowerCase()}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (members[0] ? flattenMembers(members[0]) : []).slice(0, 10).map((item, index) => ({ // Limit to 10 for brevity in head
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      }))
    }
  };
};

// Helper to count max depth (Generations)
export const countGenerations = (member: FamilyMember): number => {
  if (!member.children || member.children.length === 0) return 1;
  return 1 + Math.max(...member.children.map(countGenerations));
};
