public class Ud_arr2D {
    public static void main(String[] args) {
        int n = 4; 
        int[][] graph = new int[n][n];

        addEdge(graph, 0, 1);
        addEdge(graph, 0, 2);
        addEdge(graph, 1, 2);
        addEdge(graph, 1, 3);

        printGraph(graph);
    }

    public static void addEdge(int[][] graph, int u, int v) {
        graph[u][v] = 1;
        graph[v][u] = 1; 
    }

    public static void printGraph(int[][] graph) {
        for (int i = 0; i < graph.length; i++) {
            for (int j = 0; j < graph[i].length; j++) {
                System.out.print(graph[i][j] + " ");
            }
            System.out.println();
        }
    }
    
}
