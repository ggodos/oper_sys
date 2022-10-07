#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>


// Протестировано на Ubuntu 22.04

void handle_child() {
  for (int i = 5; i > 1; i--) {
    printf("%i\n", i);
    fflush(stdout);
    sleep(1);
  }
  puts("1");
  fflush(stdout);
  sleep(1);

  puts("Hello");
  perror("exec");
}

void handle_parent(pid_t pid) {
  int status;
  printf("Id ребёнка: %i\n", pid);
  fflush(NULL);
  if (waitpid(pid, &status, 0) != -1) {
    printf("Ребёнок вышел со статусом %i\n", status);
    puts("Bye");
  } else {
    perror("waitpid");
  }
}

int main() {
  pid_t pid = fork();
  /* puts("Создаю процесс..."); */
  /* fflush(NULL); */

  switch (pid) {
  case -1:
    perror("fork");
    break;
  case 0:
    handle_child();
    break;
  default:
    handle_parent(pid);
    break;
  }

  return 0;
}
