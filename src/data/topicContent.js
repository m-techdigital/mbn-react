export async function loadDetailedTopics() {
    const groups = await Promise.all([
        import("./topics/topicGroup1.js"),
        import("./topics/topicGroup2.js"),
        import("./topics/topicGroup3.js"),
    ]);

    return [
        ...groups[0].topicGroup1,
        ...groups[1].topicGroup2,
        ...groups[2].topicGroup3,
    ];
}
